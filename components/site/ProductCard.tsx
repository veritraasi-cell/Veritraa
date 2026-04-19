'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import type { FeaturedProduct, ShopProduct } from '@/src/data/mockData';

interface ProductCardProps {
  readonly product: FeaturedProduct | ShopProduct;
  readonly variant: 'featured' | 'shop' | 'preview';
  readonly href?: string;
  readonly compact?: boolean;
}

export default function ProductCard({
  product,
  variant,
  href,
  compact = false,
}: Readonly<ProductCardProps>) {
  const [isNavigating, setIsNavigating] = useState(false);

  if (variant === 'featured') {
    const featuredProduct = product as FeaturedProduct;

    return (
      <div className="group w-full min-w-0">
        <div className="overflow-hidden rounded-[1.45rem] border border-[#d9b98e]/40 bg-gradient-to-b from-[#fffaf3] via-[#f8ecdd] to-[#efd6b6] shadow-[0_18px_36px_-30px_rgba(112,56,18,0.45)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_28px_50px_-26px_rgba(112,56,18,0.45)]">
          <div className="relative aspect-square">
            <Image
              alt={featuredProduct.name}
              className="object-cover object-[center_16%] transition-transform duration-700 group-hover:scale-105"
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              src={featuredProduct.image}
            />
            {featuredProduct.badge ? (
              <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#8f350f]/92 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur">
                {featuredProduct.badge}
              </span>
            ) : null}
          </div>
          <div className="p-5 sm:p-6">
            <h3 className="font-headline text-lg text-[#4b2616]">{featuredProduct.name}</h3>
          </div>
        </div>
      </div>
    );
  }

  const shopProduct = product as ShopProduct;
  const card = (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-[#d9b98e]/55 bg-gradient-to-b from-[#fffaf3] via-[#f8ecdd] to-[#f0dcc3] shadow-[0_18px_36px_-28px_rgba(112,56,18,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-26px_rgba(112,56,18,0.55)] sm:rounded-[1.75rem] ${compact ? 'shadow-[0_12px_24px_-20px_rgba(112,56,18,0.5)]' : ''}`}
    >
      <div className={`relative w-full overflow-hidden bg-[#f6ead7] ${compact ? 'aspect-[5/6]' : 'aspect-[5/6] sm:aspect-[5/6]'}`}>
        <Image
          alt={shopProduct.name}
          className="object-cover object-[center_16%] transition-transform duration-700 group-hover:scale-105"
          fill
          sizes={compact ? '(min-width: 1024px) 14vw, 44vw' : '(min-width: 1024px) 20vw, 44vw'}
          src={shopProduct.image}
        />
        {shopProduct.tag ? (
          <div className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-[#8f350f]/92 px-3 py-1 font-bold text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur ${compact ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:left-4 sm:top-4 sm:px-3.5 sm:text-xs'}`}>
            <span className="material-symbols-outlined text-xs leading-none sm:text-sm">{shopProduct.tag.icon}</span>
            {shopProduct.tag.label}
          </div>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? 'p-2 sm:p-3' : 'p-3 sm:p-3'}`}>
        <div className="mb-1">
          <h3 className={`font-headline leading-tight text-[#4b2616] ${compact ? 'text-[10px] sm:text-xs' : 'text-xs sm:text-xs sm:leading-[1.06]'}`}>
            {shopProduct.name}
          </h3>
        </div>
      </div>
      {isNavigating ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(255,250,243,0.82)] backdrop-blur-[2px]" aria-hidden="true">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d9b98e]/55 bg-white/95 text-[#8f350f] shadow-[0_18px_30px_-22px_rgba(112,56,18,0.6)]">
            <LoaderCircle className="h-5 w-5 animate-spin" />
          </span>
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        aria-label={`View details for ${shopProduct.name}`}
        className="block h-full"
        href={href}
        onClick={(event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }

          setIsNavigating(true);
        }}
      >
        {card}
      </Link>
    );
  }

  return card;
}
