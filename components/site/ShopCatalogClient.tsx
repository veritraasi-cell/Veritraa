'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/site/ProductCard';
import type { ShopProduct } from '@/src/data/mockData';

export default function ShopCatalogClient({
  products,
  categories,
}: Readonly<{
  products: ShopProduct[];
  categories: string[];
}>) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
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
          This collection now shows only products that are live on Shopify. Local draft products stay hidden until they are
          pushed from the admin panel.
        </p>
      </header>

      <section className="story-surface mx-2 mb-8 rounded-3xl sm:mx-4 sm:mb-10 md:mx-6 md:mb-12">
        <div className="mx-auto max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 md:px-8">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-3 sm:gap-4 sm:pb-4">
            {categories.map((category, index) => (
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

          {!filteredProducts.length ? (
            <div className="rounded-[1.6rem] border border-[#d9bfa8]/55 bg-white/75 px-6 py-12 text-center shadow-[0_18px_36px_-28px_rgba(112,56,18,0.2)]">
              <p className="text-lg font-semibold text-[#4f1d0c]">No live Shopify products matched your search.</p>
              <p className="mt-2 text-sm text-[#6a4637]">Push more draft products from the admin panel to expand the storefront.</p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </section>

    </div>
  );
}
