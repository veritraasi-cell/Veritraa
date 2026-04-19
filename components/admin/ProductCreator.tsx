'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Plus, Trash2, Upload } from 'lucide-react';
import type { ManagedCatalogProduct } from '@/src/lib/catalog';

type Notice =
  | {
      tone: 'success' | 'error';
      message: string;
    }
  | null;

type WeightRow = {
  id: string;
  label: string;
  price: string;
  quantity: string;
};

const DEFAULT_WEIGHTS: WeightRow[] = [
  { id: '100-gm', label: '100 GM', price: '', quantity: '20' },
  { id: '250-gm', label: '250 GM', price: '', quantity: '20' },
  { id: '500-gm', label: '500 GM', price: '', quantity: '20' },
  { id: '1-kg', label: '1 KG', price: '', quantity: '20' },
];

const DEFAULT_FORM = {
  name: '',
  slug: '',
  shopifyHandle: '',
  description: '',
  image: '',
  imageAlt: '',
  highlights: '',
  vendor: 'Veritraa Enterprises',
  productType: 'Herbs & Spices',
  categoryName: 'Herbs & Spices',
  tags: 'veritraa, masala',
  tagLabel: '',
};

function createCustomWeightRow() {
  return {
    id: `custom-${crypto.randomUUID()}`,
    label: '',
    price: '',
    quantity: '20',
  };
}

function buildFormFromProduct(product: ManagedCatalogProduct | null) {
  if (!product) {
    return {
      form: DEFAULT_FORM,
      weights: DEFAULT_WEIGHTS,
    };
  }

  return {
    form: {
      name: product.name,
      slug: product.slug,
      shopifyHandle: product.shopifyHandle ?? product.slug,
      description: product.description,
      image: product.image,
      imageAlt: product.imageAlt ?? product.name,
      highlights: product.highlights.join(', '),
      vendor: product.vendor,
      productType: product.productType,
      categoryName: product.categoryName,
      tags: product.tags.join(', '),
      tagLabel: product.tag?.label ?? '',
    },
    weights: product.variantDefinitions.map((variant) => ({
      id: `variant-${variant.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      label: variant.label,
      price: variant.price,
      quantity: String(variant.quantity),
    })),
  };
}

export default function ProductCreator({
  initialProduct = null,
}: Readonly<{
  initialProduct?: ManagedCatalogProduct | null;
}>) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialState = buildFormFromProduct(initialProduct);
  const [form, setForm] = useState(initialState.form);
  const [weights, setWeights] = useState<WeightRow[]>(initialState.weights);
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const isEditMode = Boolean(initialProduct);

  useEffect(() => {
    const nextState = buildFormFromProduct(initialProduct ?? null);
    setForm(nextState.form);
    setWeights(nextState.weights);
    setNotice(null);
  }, [initialProduct]);

  useEffect(() => {
    if (!initialProduct) {
      return;
    }

    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [initialProduct?.slug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);

    try {
      const variantDefinitions = weights
        .map((weight) => ({
          label: weight.label.trim(),
          price: weight.price.trim(),
          quantity: Number(weight.quantity),
        }))
        .filter((weight) => weight.label && weight.price);

      if (!variantDefinitions.length) {
        throw new Error('Add at least one weight with a price.');
      }

      const primaryVariant =
        variantDefinitions.find((variant) => variant.label.toLowerCase() === '1 kg') ?? variantDefinitions[0];

      const action = isEditMode ? 'update-and-push-catalog-product' : 'create-and-push-catalog-product';
      const response = await fetch('/api/admin/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          originalSlug: initialProduct?.slug,
          ...form,
          sizes: variantDefinitions.map((variant) => variant.label).join(', '),
          price: variantDefinitions[0].price,
          quantity: primaryVariant.quantity,
          variantDefinitions,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? `Unable to ${isEditMode ? 'update' : 'create'} and push the product.`);
      }

      setNotice({
        tone: 'success',
        message: isEditMode
          ? 'Product updated locally and synced back to Shopify.'
          : 'Product created locally, pushed to Shopify, and made eligible for the live storefront.',
      });

      if (isEditMode) {
        router.push('/admin/products');
      } else {
        setForm(DEFAULT_FORM);
        setWeights(DEFAULT_WEIGHTS);
      }

      router.refresh();
    } catch (error) {
      setNotice({
        tone: 'error',
        message:
          error instanceof Error
            ? error.message
            : `Unable to ${isEditMode ? 'update' : 'create'} and push the product.`,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingImage(true);
    setNotice(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as { ok: boolean; error?: string; data?: { publicPath: string } };
      if (!response.ok || !payload.ok || !payload.data) {
        throw new Error(payload.error ?? 'Unable to upload image.');
      }

      setForm((current) => ({
        ...current,
        image: payload.data?.publicPath ?? current.image,
        imageAlt: current.imageAlt || current.name,
      }));
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to upload image.',
      });
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  }

  function updateField(field: keyof typeof DEFAULT_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateWeight(id: string, field: 'label' | 'price' | 'quantity', value: string) {
    setWeights((current) => current.map((weight) => (weight.id === id ? { ...weight, [field]: value } : weight)));
  }

  function addWeightRow() {
    setWeights((current) => [...current, createCustomWeightRow()]);
  }

  function removeWeightRow(id: string) {
    setWeights((current) => current.filter((weight) => weight.id !== id));
  }

  return (
    <section id="product-creator" ref={sectionRef} className="rounded-[1.9rem] border border-[#d8bea2]/70 bg-white/90 p-6 shadow-[0_18px_40px_-34px_rgba(85,33,16,0.35)] sm:p-8">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a04a1d]">
          {isEditMode ? 'Update Product' : 'Product Creator'}
        </p>
        <h2 className="font-headline text-3xl text-[#4b1f0f]">
          {isEditMode ? `Editing ${form.name}` : 'Create once, push to website and Shopify'}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-[#755245]">
          Website description is reused for Shopify, origin and ethics stay on the house style, and every weight you add
          here becomes a real Shopify variant with its own price.
        </p>
      </div>

      {notice ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
            notice.tone === 'success'
              ? 'border border-green-200 bg-green-50 text-green-900'
              : 'border border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Product title</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Slug</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] bg-[#fbf4ed] px-4 py-3 text-[#8c6a57] outline-none" value={form.slug} disabled />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f] lg:col-span-2">
            <span className="font-semibold text-[#4b1f0f]">Description</span>
            <textarea className="min-h-28 w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Image path</span>
            <div className="flex items-center gap-3 rounded-2xl border border-[#dfc5ae] px-4 py-3">
              <ImagePlus className="h-4 w-4 text-[#8a3a17]" />
              <input
                className="w-full border-0 bg-transparent outline-none"
                value={form.image}
                onChange={(event) => updateField('image', event.target.value)}
                placeholder="/uploads/products/example.png"
                required
              />
            </div>
          </div>
          <div className="flex items-end">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d8a36f] bg-[#fff6ef] px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf] disabled:opacity-60"
              disabled={uploadingImage}
            >
              <Upload className="h-4 w-4" />
              {uploadingImage ? 'Importing image...' : 'Import image'}
            </button>
          </div>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Image alt text</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.imageAlt} onChange={(event) => updateField('imageAlt', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Shopify handle</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] bg-[#fbf4ed] px-4 py-3 text-[#8c6a57] outline-none" value={form.shopifyHandle} disabled />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Vendor</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.vendor} onChange={(event) => updateField('vendor', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Product type</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.productType} onChange={(event) => updateField('productType', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Category</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.categoryName} onChange={(event) => updateField('categoryName', event.target.value)} />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f]">
            <span className="font-semibold text-[#4b1f0f]">Badge label</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.tagLabel} onChange={(event) => updateField('tagLabel', event.target.value)} placeholder="Top Seller" />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f] lg:col-span-2">
            <span className="font-semibold text-[#4b1f0f]">Highlights</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.highlights} onChange={(event) => updateField('highlights', event.target.value)} placeholder="Sharp heat, Deep spice strength, Bold finish" />
          </label>
          <label className="space-y-2 text-sm text-[#6f4b3f] lg:col-span-2">
            <span className="font-semibold text-[#4b1f0f]">Tags</span>
            <input className="w-full rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none" value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="veritraa, masala, spicy" />
          </label>
        </div>

        <div className="rounded-[1.6rem] border border-[#ead7c4] bg-[#fffaf4] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#4b1f0f]">Weights and prices</p>
              <p className="text-xs text-[#7f5a4a]">These become live Shopify weight variants on the product page.</p>
            </div>
            <button
              type="button"
              onClick={addWeightRow}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d8a36f] bg-white px-4 py-2 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
            >
              <Plus className="h-4 w-4" />
              Add custom weight
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {weights.map((weight) => (
              <div key={weight.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]">
                <input
                  className="rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none"
                  value={weight.label}
                  onChange={(event) => updateWeight(weight.id, 'label', event.target.value)}
                  placeholder="Weight label"
                />
                <input
                  className="rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none"
                  value={weight.price}
                  onChange={(event) => updateWeight(weight.id, 'price', event.target.value)}
                  placeholder="Price"
                />
                <input
                  className="rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none"
                  value={weight.quantity}
                  onChange={(event) => updateWeight(weight.id, 'quantity', event.target.value)}
                  placeholder="Opening stock"
                />
                <button
                  type="button"
                  onClick={() => removeWeightRow(weight.id)}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#e7c3b3] bg-white px-4 py-3 text-[#8a3a17] transition hover:bg-[#fff2ea]"
                  aria-label={`Remove ${weight.label || 'weight'} row`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy || uploadingImage}
            className="inline-flex items-center justify-center rounded-2xl bg-[#8a3a17] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (isEditMode ? 'Updating...' : 'Creating and pushing...') : isEditMode ? 'Update product' : 'Create product and push live'}
          </button>
          {isEditMode ? (
            <button
              type="button"
              onClick={() => {
                router.push('/admin/products');
                router.refresh();
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-[#d8a36f] bg-white px-6 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
            >
              Cancel edit
            </button>
          ) : null}
          <p className="text-xs leading-5 text-[#7f5a4a]">
            Merchant promise and origin copy stay locked to your storefront template for every product.
          </p>
        </div>
      </form>
    </section>
  );
}
