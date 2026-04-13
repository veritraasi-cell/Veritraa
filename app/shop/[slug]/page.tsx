import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Sparkles, Truck, Warehouse } from 'lucide-react';
import { brochureDownloadHref, getShopProductBySlug, shopProducts } from '@/src/data/mockData';
import { getShopifyProductUrl } from '@/src/lib/shopifyStorefront';

interface ProductPageProps {
  readonly params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return shopProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getShopProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product not found | Veritraa',
    };
  }

  return {
    title: `${product.name} | Veritraa`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = getShopProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const shopifyUrl = getShopifyProductUrl(product);

  return (
    <div className="pb-14 pt-4 text-on-background sm:pb-18 sm:pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-[#d9bfa8]/70 bg-white/80 px-4 py-2 text-sm font-semibold text-[#6f2507] shadow-[0_10px_24px_-18px_rgba(112,56,18,0.35)] transition-colors hover:bg-white"
            href="/shop"
          >
            <ArrowLeft size={16} />
            Back to all masalas
          </Link>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.28em] text-[#a04100] sm:block">
            Product details
          </p>
        </div>

        <section className="grid gap-6">
          <div className="mx-auto w-full max-w-[420px] lg:hidden">
            <div className="overflow-hidden rounded-[2rem] border border-[#d9bfa8]/55 bg-white shadow-[0_24px_54px_-36px_rgba(112,56,18,0.5)]">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
                <Image
                  alt={product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-contain object-center"
                  src={product.image}
                />
                {product.tag ? (
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-[#8f350f]/92 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur">
                    <span className="material-symbols-outlined text-sm leading-none">{product.tag.icon}</span>
                    {product.tag.label}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#e1cbb0]/70 bg-gradient-to-br from-[#fffaf5] via-[#fff6ef] to-[#f8ead9] p-5 shadow-[0_24px_56px_-40px_rgba(112,56,18,0.45)] sm:p-7 md:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#a04100]">Masala collection</p>
            <h1 className="mt-3 max-w-3xl font-headline text-3xl tracking-tight text-[#4f1d0c] sm:text-4xl md:text-[3.2rem] md:leading-[1.05]">
              {product.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6a4637] sm:text-base">
              {product.description}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-[#d9bfa8]/55 bg-white/82 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f350f]">
                Pricing handled in Shopify
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6a4637]">
                We are not setting prices locally. Once this product is created in Shopify, the live product page will
                control pricing, variants, and checkout.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.35rem] border border-white/55 bg-white/65 px-4 py-4">
                <Truck className="text-[#a04100]" size={20} />
                <p className="mt-2 text-sm font-semibold text-[#4f1d0c]">Fresh packing</p>
                <p className="mt-1 text-xs leading-5 text-[#6a4637]">Packed in 100 GM to 1 KG options.</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/55 bg-white/65 px-4 py-4">
                <Warehouse className="text-[#a04100]" size={20} />
                <p className="mt-2 text-sm font-semibold text-[#4f1d0c]">Shopify linked</p>
                <p className="mt-1 text-xs leading-5 text-[#6a4637]">Ready for product handles and cart setup.</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/55 bg-white/65 px-4 py-4">
                <Sparkles className="text-[#a04100]" size={20} />
                <p className="mt-2 text-sm font-semibold text-[#4f1d0c]">Clean detail page</p>
                <p className="mt-1 text-xs leading-5 text-[#6a4637]">Built to show story, image, and purchase path.</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f350f]">What it is good for</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[#f3dcc1] px-4 py-2 text-sm font-medium text-[#6b2a10]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {shopifyUrl ? (
                <a
                  className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-on-primary shadow-[0_14px_30px_-18px_rgba(157,70,11,0.55)] transition-transform hover:scale-105"
                  href={shopifyUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <ShoppingBag size={18} />
                  Add to cart on Shopify
                </a>
              ) : (
                <button
                  className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-on-primary opacity-70"
                  disabled
                  type="button"
                >
                  <ShoppingBag size={18} />
                  Connect Shopify product
                </button>
              )}
              <Link
                className="inline-flex items-center justify-center rounded-full border border-[#8f350f]/18 bg-white/80 px-6 py-3 text-sm font-bold text-[#6f2507] transition-colors hover:bg-white"
                href="/shop"
              >
                Continue browsing
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#8f350f]/18 bg-white/80 px-6 py-3 text-sm font-bold text-[#6f2507] transition-colors hover:bg-white"
                href={brochureDownloadHref}
                download
              >
                Download Brochure
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
