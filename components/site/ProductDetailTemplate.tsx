'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Leaf, Package, ShoppingBag, Tag } from 'lucide-react';
import AddToCartButton from '@/components/site/AddToCartButton';
import ProductLikeButton from '@/components/site/ProductLikeButton';
import type { ShopProduct } from '@/src/data/mockData';

type StorefrontVariant = {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
};

export default function ProductDetailTemplate({
  product,
  variants,
  storefrontError,
  brochureDownloadHref,
}: Readonly<{
  product: ShopProduct;
  variants: StorefrontVariant[];
  storefrontError: string | null;
  brochureDownloadHref: string;
}>) {
  const defaultWeight = variants[0]?.title || product.variantDefinitions?.[0]?.label || product.sizes[0] || '250 GM';
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);
  const selectedVariant =
    variants.find((variant) =>
      variant.title === selectedWeight
    ) ??
    variants.find((variant) => variant.title.toLowerCase() === selectedWeight.toLowerCase()) ??
    variants[0] ??
    null;
  const originStory = `Harvested and blended for dependable kitchen performance, ${product.name} is prepared to hold its aroma, color, and character from first tempering to final garnish.`;
  const merchantPromise = "Spices shouldn't travel the world; they should carry its soul.";

  const featureCards = [
    {
      title: 'Fresh packing',
      desc: `Packed in ${product.sizes[0] ?? 'multiple'} formats to preserve aroma and shelf confidence.`,
      icon: Package,
      accent: 'bg-[#ffdbcd] text-[#7a2f07]',
    },
    {
      title: 'Shopify linked',
      desc: 'Live price, inventory, cart, and checkout all run through Shopify.',
      icon: Tag,
      accent: 'bg-[#ffdea5] text-[#775a19]',
    },
    {
      title: 'Clean detail page',
      desc: 'Every live product now follows the new editorial product template.',
      icon: BookOpen,
      accent: 'bg-[#ffdad5] text-[#a6392d]',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[#fef9f2] pb-12 text-[#1d1c18]">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/shop" className="group inline-flex items-center gap-2 text-[#55433b] transition-colors hover:text-[#99461e]">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Back to Collections</span>
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-6 pb-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-[2rem] bg-[#f8f3ec] shadow-sm">
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.imageAlt ?? product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(min-width: 1024px) 32vw, 100vw"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <section>
              <div className="mb-4 flex flex-wrap gap-2">
                {product.highlights.slice(0, 3).map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[#ffdbcd] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7a2f07]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <h1 className="font-headline text-3xl leading-tight text-[#1d1c18] lg:text-5xl">{product.name}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#55433b]">{product.description}</p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-headline text-3xl text-[#99461e]">
                  {selectedVariant ? selectedVariant.price.amount : product.price ?? '45.00'}
                </span>
                <span className="font-headline text-lg uppercase italic text-[#99461e]/70">
                  {selectedVariant ? selectedVariant.price.currencyCode : 'INR'}
                </span>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#55433b]">Select Weight</h3>
              <div className="flex flex-wrap gap-2">
                {(product.variantDefinitions?.map((variant) => variant.label) ?? product.sizes).map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    onClick={() => setSelectedWeight(weight)}
                    className={`rounded-full border px-4 py-2 text-xs transition-all ${
                      selectedWeight === weight
                        ? 'border-2 border-[#99461e] bg-[#ffdbcd] font-bold text-[#7a2f07]'
                        : 'border-[#dbc1b7] bg-white text-[#55433b] hover:border-[#99461e]/40 hover:text-[#99461e]'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex max-w-md flex-col gap-3">
              {selectedVariant ? (
                <AddToCartButton merchandiseId={selectedVariant.id} />
              ) : (
                <button
                  className="inline-flex items-center justify-between rounded-full bg-[#99461e] px-8 py-4 text-base font-bold text-white opacity-70"
                  disabled
                  type="button"
                >
                  <span>Product not live in Shopify yet</span>
                  <ShoppingBag className="h-5 w-5" />
                </button>
              )}
              <p className="text-center text-[10px] uppercase tracking-tight text-[#55433b]">
                Complimentary shipping on orders over 500 INR
              </p>
              {storefrontError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {storefrontError}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Link href="/cart" className="rounded-full border border-[#dbc1b7] bg-white px-5 py-3 text-sm font-bold text-[#99461e]">
                  Open cart
                </Link>
                <a
                  href={brochureDownloadHref}
                  download
                  className="rounded-full border border-[#dbc1b7] bg-white px-5 py-3 text-sm font-bold text-[#99461e]"
                >
                  Download brochure
                </a>
              </div>
              <ProductLikeButton productSlug={product.slug} />
            </section>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-8 overflow-hidden rounded-[2rem] bg-[#ffdea5]/20 p-8">
          <div className="flex-1">
            <h4 className="font-headline text-2xl italic text-[#775a19]">Origin & Ethics</h4>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#55433b]">{originStory}</p>
          </div>
          <Leaf className="h-16 w-16 shrink-0 text-[#775a19]/15" />
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureCards.map((item) => (
            <article key={item.title} className="flex items-start gap-4 rounded-[1.5rem] border border-[#dbc1b7]/40 bg-white p-6 shadow-sm">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.accent}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-headline text-lg text-[#1d1c18]">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#55433b]">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-24 max-w-4xl border-t border-[#dbc1b7]/50 py-20 text-center">
          <span className="mb-8 block text-xs font-bold uppercase tracking-[0.2em] text-[#99461e]">The Merchant&apos;s Promise</span>
          <h2 className="font-headline text-4xl italic leading-tight text-[#1d1c18] lg:text-6xl">{merchantPromise}</h2>
          <div className="mt-10 flex justify-center">
            <div className="h-px w-24 bg-[#dbc1b7]" />
          </div>
        </div>
      </main>
    </div>
  );
}
