'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';

type DashboardData = {
  shopName: string;
  myshopifyDomain: string;
  currencyCode: string;
  productsCount: number;
  ordersCount: number;
  productVariantsCount: number;
  recentProducts: Array<{
    id: string;
    title: string;
    status: string;
    totalInventory: number;
    updatedAt: string;
  }>;
  recentOrders: Array<{
    id: string;
    name: string;
    displayFinancialStatus: string;
    displayFulfillmentStatus: string | null;
    createdAt: string;
    totalPriceSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
    customer: {
      displayName: string | null;
      email: string | null;
    } | null;
  }>;
};

type ProductLookup = {
  product: {
    id: string;
    title: string;
    handle: string;
    status: string;
    variants: Array<{
      id: string;
      title: string;
      price: string;
      inventoryQuantity: number | null;
      inventoryItem: { id: string } | null;
    }>;
  };
  locations: Array<{ id: string; name: string }>;
};

type OrderLookup = {
  order: {
    id: string;
    name: string;
    displayFinancialStatus: string;
    displayFulfillmentStatus: string | null;
    createdAt: string;
    totalPriceSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
    lineItems: Array<{
      title: string;
      quantity: number;
    }>;
  };
};

type CustomerLookup = {
  customer: {
    id: string;
    displayName: string | null;
    email: string | null;
    phone: string | null;
    state: string;
    numberOfOrders: number;
  };
};

type Notice = { tone: 'success' | 'error'; title: string; message: string } | null;

type FormState = {
  productLookupId: string;
  orderLookupId: string;
  customerLookupId: string;
  productId: string;
  variantRows: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  tags: string;
  price: string;
  mediaUrl: string;
  mediaAlt: string;
  imageProductId: string;
  imageUrl: string;
  imageAlt: string;
  deleteProductId: string;
  inventoryItemId: string;
  locationId: string;
  quantity: string;
  orderId: string;
  orderEmail: string;
  orderTags: string;
  customerId: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  customerTags: string;
};

async function callAdminApi<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as { ok: boolean; data?: T; error?: string };
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? 'Shopify admin request failed.');
  }

  return payload.data as T;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}>) {
  return (
    <section className="rounded-[1.6rem] border border-[#d8bea2]/70 bg-white/80 p-5 shadow-[0_18px_40px_-34px_rgba(85,33,16,0.45)] sm:p-6">
      <div className="mb-5 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#a04a1d]">{eyebrow}</p>
        <h2 className="font-headline text-2xl text-[#4b1f0f]">{title}</h2>
        <p className="max-w-3xl text-sm leading-6 text-[#755245]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}>) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5a4d]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#dcc6ae] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#c98350] focus:ring-2 focus:ring-[#f0caa5]/45"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: Readonly<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}>) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5a4d]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-[#dcc6ae] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#c98350] focus:ring-2 focus:ring-[#f0caa5]/45"
      />
    </label>
  );
}

export default function ShopifyAdminWorkbench({
  initialData,
}: Readonly<{ initialData: DashboardData }>) {
  const router = useRouter();
  const data = initialData;
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [productLookup, setProductLookup] = useState<ProductLookup | null>(null);
  const [orderLookup, setOrderLookup] = useState<OrderLookup | null>(null);
  const [customerLookup, setCustomerLookup] = useState<CustomerLookup | null>(null);
  const [state, setState] = useState<FormState>({
    productLookupId: '',
    orderLookupId: '',
    customerLookupId: '',
    productId: '',
    variantRows: '',
    title: '',
    descriptionHtml: '',
    vendor: '',
    productType: '',
    status: 'DRAFT',
    tags: '',
    price: '',
    mediaUrl: '',
    mediaAlt: '',
    imageProductId: '',
    imageUrl: '',
    imageAlt: '',
    deleteProductId: '',
    inventoryItemId: '',
    locationId: '',
    quantity: '',
    orderId: '',
    orderEmail: '',
    orderTags: '',
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    customerTags: '',
  });

  function showNotice(tone: NonNullable<Notice>['tone'], title: string, message: string) {
    setNotice({ tone, title, message });
  }

  function updateState<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function refreshDashboard() {
    router.refresh();
  }

  async function lookupProduct() {
    if (!state.productLookupId.trim()) {
      showNotice('error', 'Product lookup failed', 'Enter a product ID first.');
      return;
    }

    setBusy('product-lookup');
    try {
      const result = await callAdminApi<ProductLookup>(
        `/api/admin/shopify?action=product&id=${encodeURIComponent(state.productLookupId.trim())}`
      );
      setProductLookup(result);
      updateState('productId', result.product.id);
      if (result.locations[0]) {
        updateState('locationId', result.locations[0].id);
      }
      showNotice('success', 'Product loaded', `${result.product.title} is ready for updates.`);
    } catch (error) {
      showNotice('error', 'Product lookup failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setBusy(null);
    }
  }

  async function lookupOrder() {
    if (!state.orderLookupId.trim()) {
      showNotice('error', 'Order lookup failed', 'Enter an order ID first.');
      return;
    }

    setBusy('order-lookup');
    try {
      const result = await callAdminApi<OrderLookup>(
        `/api/admin/shopify?action=order&id=${encodeURIComponent(state.orderLookupId.trim())}`
      );
      setOrderLookup(result);
      updateState('orderId', result.order.id);
      showNotice('success', 'Order loaded', `${result.order.name} is ready for updates.`);
    } catch (error) {
      showNotice('error', 'Order lookup failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setBusy(null);
    }
  }

  async function lookupCustomer() {
    if (!state.customerLookupId.trim()) {
      showNotice('error', 'Customer lookup failed', 'Enter a customer ID first.');
      return;
    }

    setBusy('customer-lookup');
    try {
      const result = await callAdminApi<CustomerLookup>(
        `/api/admin/shopify?action=customer&id=${encodeURIComponent(state.customerLookupId.trim())}`
      );
      setCustomerLookup(result);
      updateState('customerId', result.customer.id);
      showNotice('success', 'Customer loaded', `${result.customer.displayName ?? 'Customer'} is ready for updates.`);
    } catch (error) {
      showNotice('error', 'Customer lookup failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setBusy(null);
    }
  }

  async function submitAction<T>(
    action: string,
    payload: Record<string, unknown>,
    successTitle: string,
    successMessage: string
  ) {
    setBusy(action);
    try {
      const result = await callAdminApi<T>('/api/admin/shopify', {
        method: 'POST',
        body: JSON.stringify({ action, ...payload }),
      });
      showNotice('success', successTitle, successMessage);
      await refreshDashboard();
      return result;
    } catch (error) {
      showNotice('error', successTitle, error instanceof Error ? error.message : 'Unknown error');
      return null;
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="mx-auto mt-6 max-w-7xl px-4 pb-14 sm:px-6 md:px-8">
      <div className="rounded-[2rem] border border-[#4f2d21]/20 bg-[linear-gradient(135deg,#fff7ec,#f7e0c4)] p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.7)] sm:p-8">
        <p className="inline-flex items-center rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
          Shopify Admin Workbench
        </p>
        <h1 className="mt-4 font-headline text-3xl text-[#4b1f0f] sm:text-5xl">{data.shopName}</h1>
        <p className="mt-2 text-sm text-[#734f42] sm:text-base">{data.myshopifyDomain}</p>
      </div>

      {notice ? (
        <div
          className={`mt-6 rounded-2xl border px-5 py-4 text-sm shadow-sm ${
            notice.tone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
        >
          <p className="font-semibold">{notice.title}</p>
          <p className="mt-1">{notice.message}</p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#e4c6a9] bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Products</p>
          <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.productsCount}</p>
        </div>
        <div className="rounded-2xl border border-[#e4c6a9] bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Orders</p>
          <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.ordersCount}</p>
        </div>
        <div className="rounded-2xl border border-[#e4c6a9] bg-white/85 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Product Variants</p>
          <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.productVariantsCount}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section eyebrow="Phase 1" title="Product lookup and detail" description="Load a product to inspect its variant and inventory IDs.">
          <div className="flex flex-col gap-3 sm:flex-row">
            <TextInput
              label="Product lookup ID"
              value={state.productLookupId}
              onChange={(value) => updateState('productLookupId', value)}
              placeholder="gid://shopify/Product/..."
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={lookupProduct}
                className="rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
                disabled={busy === 'product-lookup'}
              >
                {busy === 'product-lookup' ? 'Loading...' : 'Load Product'}
              </button>
            </div>
          </div>
          {productLookup ? (
            <div className="mt-5 space-y-4 rounded-[1.35rem] border border-[#ebd5c2] bg-[#fffaf4] p-4">
              <div>
                <p className="text-lg font-semibold text-[#4b1f0f]">{productLookup.product.title}</p>
                <p className="text-sm text-[#7f5a4a]">{productLookup.product.handle}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#a04a1d]">{productLookup.product.status}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {productLookup.product.variants.map((variant) => (
                  <div key={variant.id} className="rounded-2xl border border-[#e6d0ba] bg-white p-3 text-sm">
                    <p className="font-semibold text-[#4b1f0f]">{variant.title}</p>
                    <p className="mt-1 text-[#6f4b3f]">Variant ID: {variant.id}</p>
                    <p className="text-[#6f4b3f]">Inventory Item ID: {variant.inventoryItem?.id ?? 'Not available'}</p>
                    <p className="text-[#6f4b3f]">Price: {variant.price}</p>
                    <button
                      type="button"
                      onClick={() => updateState('inventoryItemId', variant.inventoryItem?.id ?? '')}
                      className="mt-3 rounded-full border border-[#d8a36f] px-3 py-1.5 text-xs font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
                    >
                      Use for stock
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {productLookup.locations.map((location) => (
                  <button
                    key={location.id}
                    type="button"
                    onClick={() => updateState('locationId', location.id)}
                    className="rounded-2xl border border-[#e6d0ba] bg-white px-4 py-3 text-left text-sm transition hover:bg-[#fff4e8]"
                  >
                    <p className="font-semibold text-[#4b1f0f]">{location.name}</p>
                    <p className="mt-1 break-all text-xs text-[#7f5a4a]">{location.id}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </Section>

        <Section
          eyebrow="Recent Activity"
          title="Latest products and orders"
          description="A quick read on the newest Shopify data already synced into the dashboard."
        >
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7d5a4d]">Recent products</p>
              <div className="mt-3 space-y-3">
                {data.recentProducts.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-[#e6d0ba] bg-[#fffaf4] p-4">
                    <p className="font-semibold text-[#4b1f0f]">{product.title}</p>
                    <p className="text-xs text-[#7f5a4a]">{product.totalInventory} in stock</p>
                    <p className="text-xs text-[#7f5a4a]">{formatDateTime(product.updatedAt)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7d5a4d]">Recent orders</p>
              <div className="mt-3 space-y-3">
                {data.recentOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-[#e6d0ba] bg-[#fffaf4] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#4b1f0f]">{order.name}</p>
                        <p className="text-xs text-[#7f5a4a]">
                          {order.customer?.displayName ?? order.customer?.email ?? 'Customer not available'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[#6b2b12]">
                        {order.totalPriceSet.shopMoney.amount} {order.totalPriceSet.shopMoney.currencyCode}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-[#7f5a4a]">
                      {order.displayFinancialStatus} | {order.displayFulfillmentStatus ?? 'UNFULFILLED'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Phase 1"
          title="Bulk price change"
          description="Paste one variant per line in the format variantId, price, compareAtPrice(optional)."
        >
          <div className="grid gap-4">
            <TextInput
              label="Product ID"
              value={state.productId}
              onChange={(value) => updateState('productId', value)}
              placeholder="Use a product id from lookup"
            />
            <TextArea
              label="Variant rows"
              value={state.variantRows}
              onChange={(value) => updateState('variantRows', value)}
              placeholder="gid://shopify/ProductVariant/1, 199.00&#10;gid://shopify/ProductVariant/2, 249.00"
              rows={5}
            />
            <button
              type="button"
              onClick={() =>
                submitAction(
                  'bulk-price-update',
                  { productId: state.productId, variantRows: state.variantRows },
                  'Bulk price update complete',
                  'Variant prices were updated on Shopify.'
                )
              }
              className="w-full rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
              disabled={busy === 'bulk-price-update'}
            >
              {busy === 'bulk-price-update' ? 'Updating...' : 'Update Prices'}
            </button>
          </div>
        </Section>

        <Section
          eyebrow="Phase 1"
          title="Product create and image"
          description="Create a new product, set a starting price, and optionally attach a product image by URL."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Title" value={state.title} onChange={(value) => updateState('title', value)} />
            <TextInput label="Vendor" value={state.vendor} onChange={(value) => updateState('vendor', value)} />
            <TextInput label="Product type" value={state.productType} onChange={(value) => updateState('productType', value)} />
            <TextInput label="Initial price" value={state.price} onChange={(value) => updateState('price', value)} placeholder="199.00" />
            <TextInput label="Tags" value={state.tags} onChange={(value) => updateState('tags', value)} placeholder="masala, premium" />
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5a4d]">Status</span>
              <select
                value={state.status}
                onChange={(event) => updateState('status', event.target.value as FormState['status'])}
                className="w-full rounded-2xl border border-[#dcc6ae] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#c98350] focus:ring-2 focus:ring-[#f0caa5]/45"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
            <TextInput label="Image URL" value={state.mediaUrl} onChange={(value) => updateState('mediaUrl', value)} />
            <TextInput label="Image alt" value={state.mediaAlt} onChange={(value) => updateState('mediaAlt', value)} />
            <div className="sm:col-span-2">
              <TextArea
                label="Description HTML"
                value={state.descriptionHtml}
                onChange={(value) => updateState('descriptionHtml', value)}
                placeholder="<p>Clean-label spice blend...</p>"
                rows={5}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              submitAction(
                'create-product',
                {
                  title: state.title,
                  descriptionHtml: state.descriptionHtml,
                  vendor: state.vendor,
                  productType: state.productType,
                  status: state.status,
                  tags: state.tags,
                  price: state.price,
                  mediaUrl: state.mediaUrl,
                  mediaAlt: state.mediaAlt,
                },
                'Product created',
                'The product was created successfully.'
              )
            }
            className="mt-4 w-full rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
            disabled={busy === 'create-product'}
          >
            {busy === 'create-product' ? 'Creating...' : 'Create Product'}
          </button>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TextInput label="Product ID for image" value={state.imageProductId} onChange={(value) => updateState('imageProductId', value)} />
            <TextInput label="Image URL" value={state.imageUrl} onChange={(value) => updateState('imageUrl', value)} />
            <div className="sm:col-span-2">
              <TextInput label="Alt text" value={state.imageAlt} onChange={(value) => updateState('imageAlt', value)} />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              submitAction(
                'add-product-image',
                {
                  productId: state.imageProductId,
                  imageUrl: state.imageUrl,
                  altText: state.imageAlt,
                },
                'Image added',
                'The product image was added to Shopify.'
              )
            }
            className="mt-4 w-full rounded-2xl border border-[#c98350] bg-white px-5 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#fff4e8]"
            disabled={busy === 'add-product-image'}
          >
            {busy === 'add-product-image' ? 'Adding...' : 'Add Product Image'}
          </button>
        </Section>

        <Section
          eyebrow="Phase 1"
          title="Stock and deletion"
          description="Update inventory quantity or remove a product when it is no longer needed."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <TextInput label="Inventory item id" value={state.inventoryItemId} onChange={(value) => updateState('inventoryItemId', value)} />
            <TextInput label="Location id" value={state.locationId} onChange={(value) => updateState('locationId', value)} />
            <TextInput label="Quantity" value={state.quantity} onChange={(value) => updateState('quantity', value)} placeholder="120" />
          </div>
          <button
            type="button"
            onClick={() =>
              submitAction(
                'set-stock',
                {
                  inventoryItemId: state.inventoryItemId,
                  locationId: state.locationId,
                  quantity: state.quantity,
                },
                'Stock updated',
                'Inventory quantity was updated successfully.'
              )
            }
            className="mt-4 w-full rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
            disabled={busy === 'set-stock'}
          >
            {busy === 'set-stock' ? 'Updating...' : 'Update Stock'}
          </button>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <TextInput label="Delete product id" value={state.deleteProductId} onChange={(value) => updateState('deleteProductId', value)} />
            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  submitAction(
                    'delete-product',
                    { productId: state.deleteProductId },
                    'Product deleted',
                    'The product was removed from Shopify.'
                  )
                }
                className="w-full rounded-2xl border border-red-300 bg-red-50 px-5 py-3 text-sm font-semibold text-red-900 transition hover:bg-red-100"
                disabled={busy === 'delete-product'}
              >
                {busy === 'delete-product' ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Phase 1"
          title="Orders"
          description="Fetch an order, review the details, and update the order email or tags."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <TextInput label="Order lookup ID" value={state.orderLookupId} onChange={(value) => updateState('orderLookupId', value)} />
            <div className="flex items-end">
              <button
                type="button"
                onClick={lookupOrder}
                className="rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
                disabled={busy === 'order-lookup'}
              >
                {busy === 'order-lookup' ? 'Loading...' : 'Load Order'}
              </button>
            </div>
          </div>
          {orderLookup ? (
            <div className="mt-5 rounded-[1.35rem] border border-[#ebd5c2] bg-[#fffaf4] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[#4b1f0f]">{orderLookup.order.name}</p>
                  <p className="text-sm text-[#7f5a4a]">{orderLookup.order.displayFinancialStatus}</p>
                </div>
                <p className="text-sm font-semibold text-[#6b2b12]">
                  {orderLookup.order.totalPriceSet.shopMoney.amount} {orderLookup.order.totalPriceSet.shopMoney.currencyCode}
                </p>
              </div>
              <div className="mt-3 space-y-2 text-sm text-[#6f4b3f]">
                {orderLookup.order.lineItems.map((item, index) => (
                  <p key={`${item.title}-${index}`}>
                    {item.quantity} x {item.title}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TextInput label="Order id" value={state.orderId} onChange={(value) => updateState('orderId', value)} />
            <TextInput label="Customer email" value={state.orderEmail} onChange={(value) => updateState('orderEmail', value)} />
            <div className="sm:col-span-2">
              <TextInput label="Order tags" value={state.orderTags} onChange={(value) => updateState('orderTags', value)} />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              submitAction(
                'update-order',
                {
                  orderId: state.orderId,
                  email: state.orderEmail,
                  tags: state.orderTags,
                },
                'Order updated',
                'The order details were updated successfully.'
              )
            }
            className="mt-4 w-full rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
            disabled={busy === 'update-order'}
          >
            {busy === 'update-order' ? 'Updating...' : 'Update Order'}
          </button>
        </Section>

        <Section
          eyebrow="Phase 1"
          title="Customer data"
          description="Fetch a customer and update basic contact details or tags."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <TextInput label="Customer lookup ID" value={state.customerLookupId} onChange={(value) => updateState('customerLookupId', value)} />
            <div className="flex items-end">
              <button
                type="button"
                onClick={lookupCustomer}
                className="rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
                disabled={busy === 'customer-lookup'}
              >
                {busy === 'customer-lookup' ? 'Loading...' : 'Load Customer'}
              </button>
            </div>
          </div>
          {customerLookup ? (
            <div className="mt-5 rounded-[1.35rem] border border-[#ebd5c2] bg-[#fffaf4] p-4">
              <p className="text-lg font-semibold text-[#4b1f0f]">{customerLookup.customer.displayName ?? 'Customer'}</p>
              <p className="text-sm text-[#7f5a4a]">{customerLookup.customer.email ?? 'No email available'}</p>
              <p className="mt-2 text-xs text-[#7f5a4a]">
                Orders: {customerLookup.customer.numberOfOrders} | State: {customerLookup.customer.state}
              </p>
            </div>
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <TextInput label="Customer id" value={state.customerId} onChange={(value) => updateState('customerId', value)} />
            <TextInput label="First name" value={state.customerFirstName} onChange={(value) => updateState('customerFirstName', value)} />
            <TextInput label="Last name" value={state.customerLastName} onChange={(value) => updateState('customerLastName', value)} />
            <TextInput label="Email" value={state.customerEmail} onChange={(value) => updateState('customerEmail', value)} />
            <TextInput label="Phone" value={state.customerPhone} onChange={(value) => updateState('customerPhone', value)} />
            <div className="sm:col-span-2">
              <TextInput label="Customer tags" value={state.customerTags} onChange={(value) => updateState('customerTags', value)} />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              submitAction(
                'update-customer',
                {
                  customerId: state.customerId,
                  firstName: state.customerFirstName,
                  lastName: state.customerLastName,
                  email: state.customerEmail,
                  phone: state.customerPhone,
                  tags: state.customerTags,
                },
                'Customer updated',
                'The customer record was updated successfully.'
              )
            }
            className="mt-4 w-full rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
            disabled={busy === 'update-customer'}
          >
            {busy === 'update-customer' ? 'Updating...' : 'Update Customer'}
          </button>
        </Section>

        <Section
          eyebrow="Phased roadmap"
          title="Next rollout stages"
          description="These are the sensible next layers once the core Shopify admin actions are stable."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              'Bulk product import and CSV upload',
              'Collections and collection ordering',
              'Discounts, coupons, and campaign tools',
              'SEO fields, metafields, and content blocks',
              'Fulfillment and shipment status automation',
              'Analytics, low-stock alerts, and audit logs',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[#e6d0ba] bg-[#fffaf4] p-4 text-sm text-[#5c3d31]">
                {item}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
}
