'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/site/ProductCard';
import { brochureDownloadHref, shopCategories, shopProducts } from '@/src/data/mockData';

export default function ShopPage() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = shopProducts.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="pb-16 pt-6 text-on-background sm:pb-20 sm:pt-8">
      <header className="mx-auto max-w-screen-2xl px-4 py-8 text-center sm:px-6 sm:py-10 md:px-8 md:py-14">
        <h1 className="mb-3 font-headline text-3xl tracking-tight sm:text-4xl md:mb-4 md:text-6xl">
          The Modern Apothecary
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-on-surface-variant opacity-80 sm:text-base md:text-lg">
          Browse every masala, open any product to view its story and packing sizes, then continue
          to Shopify when you are ready to place the order.
        </p>
      </header>

      <section className="story-surface mx-2 mb-8 rounded-3xl sm:mx-4 sm:mb-10 md:mx-6 md:mb-12">
        <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 md:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3 sm:gap-4 sm:pb-4">
            {shopCategories.map((category, index) => (
              <button
                key={category}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-label text-xs sm:px-6 sm:text-sm ${
                  index === 0
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant transition-colors hover:bg-surface-container-highest'
                }`}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl py-6 sm:mx-4 sm:py-7 md:mx-6 md:py-8">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#d9bfa8]/55 bg-white/70 px-4 py-3 shadow-[0_12px_30px_-24px_rgba(112,56,18,0.45)] sm:mb-5 sm:px-5">
            <Search className="text-[#8f350f]" size={18} />
            <input
              aria-label="Search masalas"
              className="w-full border-0 bg-transparent text-sm text-[#4b2616] outline-none placeholder:text-[#a77a5a] sm:text-base"
              placeholder="Search masalas"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="text-[#8f350f] transition-colors hover:text-[#6f2507]"
                onClick={() => setQuery('')}
                type="button"
              >
                <X size={18} />
              </button>
            ) : null}
          </div>

          <div className="md:hidden">
            <div className="max-h-[78vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-2 pb-2">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.name}
                    compact
                    href={`/shop/${product.slug}`}
                    product={product}
                    variant="shop"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="hidden grid-cols-2 gap-3 min-[520px]:grid-cols-3 sm:grid sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.name} href={`/shop/${product.slug}`} product={product} variant="shop" />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-screen-2xl px-4 sm:mt-20 sm:px-6 md:mt-24 md:px-8">
        <div className="rounded-3xl border border-[#d9bfa8]/55 bg-gradient-to-br from-[#fff8ef] via-[#fff2e4] to-[#f6e1c8] p-6 shadow-[0_24px_48px_-34px_rgba(92,31,16,0.8)] sm:p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a04100]">Shopify ready</p>
            <h2 className="mt-3 font-headline text-2xl tracking-tight text-[#4f1d0c] sm:text-3xl md:text-4xl">
              Click a masala to open its product page
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6a4637] sm:text-base md:text-lg">
              Each card now leads to a dedicated detail page where we can add product information, images, pack sizes,
              and a Shopify checkout link once the product is connected in your store.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="spice-gradient inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-on-primary transition-transform hover:scale-105"
                href="/shop"
              >
                Browse All Masalas
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#8f350f]/30 bg-white/70 px-6 py-3 text-sm font-bold text-[#6f2507] transition-colors hover:bg-white"
                href={brochureDownloadHref}
                download
              >
                Download Brochure
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#8f350f]/30 bg-white/70 px-6 py-3 text-sm font-bold text-[#6f2507] transition-colors hover:bg-white"
                href="https://www.shopify.com/"
                rel="noreferrer"
                target="_blank"
              >
                Shopify Reference
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-screen-2xl px-4 sm:mt-20 sm:px-6 md:mt-24 md:px-8">
        <div className="flex flex-col justify-between gap-8 rounded-2xl bg-surface-container-low p-6 sm:gap-10 sm:p-8 md:flex-row md:items-center md:gap-12 md:p-16 lg:p-24">
          <div className="max-w-xl">
            <h2 className="mb-3 font-headline text-2xl tracking-tight sm:text-3xl md:mb-4 md:text-4xl">Join the Spice Circle</h2>
            <p className="mb-6 text-sm text-on-surface-variant opacity-80 sm:text-base md:mb-8">
              Receive monthly recipes from our master blenders and early access to our
              limited-run export collections.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                className="flex-1 rounded-md border-none bg-surface-container-high px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 sm:px-6 sm:text-base"
                placeholder="Email address"
                type="email"
              />
              <button className="spice-gradient rounded-full px-6 py-3 text-sm font-label font-semibold text-on-primary transition-transform hover:scale-105 sm:px-8 sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
          <div className="hidden h-72 w-72 overflow-hidden rounded-full md:block">
            <img
              alt="Colorful spice containers"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXcV_FQN2lUmshH7132dpXtvWJgYmrQ4AgnytqR_6nkCFJGX-N1qLC--SXt0dI6k0SOnEMBVyv9vE0RvmVEN1HPg5IS2XOFRf2xtiZSrxYaifvrx1tg1l_o4peDioKTxh2S4wCmmlrt-aTNU7UPYTpDLiLmSmpGTXLaESoloQbSfTlKJwKCMdxIRR0GD1ZdfCsHR51BHXMv-x7RVWbbBEkC6o_rJnTofCD9JoRjzK5YROts6xuP6lfXoCGMtOBd_GYQrRfP3pZmtY"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
