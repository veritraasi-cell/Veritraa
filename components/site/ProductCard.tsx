import type { FeaturedProduct, ShopProduct } from '@/src/data/mockData';

interface ProductCardProps {
  readonly product: FeaturedProduct | ShopProduct;
  readonly variant: 'featured' | 'shop' | 'preview';
}

function renderStars(rating: FeaturedProduct['rating']) {
  if (rating === 4.5) {
    return (
      <>
        <span className="material-symbols-outlined text-sm text-tertiary">star</span>
        <span className="material-symbols-outlined text-sm text-tertiary">star</span>
        <span className="material-symbols-outlined text-sm text-tertiary">star</span>
        <span className="material-symbols-outlined text-sm text-tertiary">star</span>
        <span className="material-symbols-outlined text-sm text-tertiary">star_half</span>
      </>
    );
  }

  return (
    <>
      <span className="material-symbols-outlined text-sm text-tertiary">star</span>
      <span className="material-symbols-outlined text-sm text-tertiary">star</span>
      <span className="material-symbols-outlined text-sm text-tertiary">star</span>
      <span className="material-symbols-outlined text-sm text-tertiary">star</span>
      <span className="material-symbols-outlined text-sm text-tertiary">star</span>
    </>
  );
}

export default function ProductCard({
  product,
  variant,
}: Readonly<ProductCardProps>) {
  if (variant === 'preview') {
    const shopProduct = product as ShopProduct;

    return (
      <div className="group flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-[#d9b98e]/55 bg-gradient-to-b from-[#fffaf3] via-[#f8ecdd] to-[#f0dcc3] shadow-[0_18px_36px_-28px_rgba(112,56,18,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-26px_rgba(112,56,18,0.55)] sm:rounded-[1.75rem]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f6ead7] sm:aspect-[3/4]">
          <img
            alt={shopProduct.name}
            className="h-full w-full object-cover object-[center_16%] transition-transform duration-700 group-hover:scale-105"
            src={shopProduct.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4f2410]/18 via-transparent to-transparent" />
          {shopProduct.tag ? (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-[#8f350f]/92 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-xs">
              <span className="material-symbols-outlined text-xs leading-none sm:text-sm">{shopProduct.tag.icon}</span>
              {shopProduct.tag.label}
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-3">
            <div className="mb-2 h-1.5 w-10 rounded-full bg-gradient-to-r from-[#8f350f] via-[#f0a15f] to-[#d8b266]" />
            <h3 className="mb-2 min-h-[2.8rem] font-headline text-base leading-tight text-[#4b2616] min-[400px]:text-[1.05rem] sm:min-h-[52px] sm:text-xl sm:leading-[1.05]">
              {shopProduct.name}
            </h3>
            <p className="hidden text-[11px] leading-5 text-on-surface-variant/90 min-[400px]:block sm:text-sm sm:leading-5">
              {shopProduct.description}
            </p>
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-white/40 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f350f]">
              Crafted blend
            </span>
            <span className="rounded-full bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#6f2507] shadow-sm">
              View details
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    const featuredProduct = product as FeaturedProduct;

    return (
      <div className="group w-full min-w-0">
      <div className="overflow-hidden rounded-[1.45rem] border border-[#d9b98e]/40 bg-gradient-to-b from-[#fffaf3] via-[#f8ecdd] to-[#efd6b6] shadow-[0_18px_36px_-30px_rgba(112,56,18,0.45)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_28px_50px_-26px_rgba(112,56,18,0.45)]">
        <div className="relative aspect-square">
          <img
            alt={featuredProduct.name}
            className="h-full w-full object-cover object-[center_16%] transition-transform duration-700 group-hover:scale-105"
            src={featuredProduct.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4f2410]/18 via-transparent to-transparent" />
          {featuredProduct.badge ? (
            <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-[#8f350f]/92 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur">
              {featuredProduct.badge}
              </span>
            ) : null}
          </div>
          <div className="p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-1">
              {renderStars(featuredProduct.rating)}
              <span className="ml-1 text-xs text-on-surface-variant">{featuredProduct.reviews}</span>
            </div>
            <h3 className="mb-2 font-headline text-lg text-[#4b2616]">{featuredProduct.name}</h3>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f350f]">
              Heritage selection
            </p>
          </div>
        </div>
      </div>
    );
  }

  const shopProduct = product as ShopProduct;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-[#d9b98e]/55 bg-gradient-to-b from-[#fffaf3] via-[#f8ecdd] to-[#f0dcc3] shadow-[0_18px_36px_-28px_rgba(112,56,18,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-26px_rgba(112,56,18,0.55)] sm:rounded-[1.75rem]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f6ead7] sm:aspect-[3/4]">
        <img
          alt={shopProduct.name}
          className="h-full w-full object-cover object-[center_16%] transition-transform duration-700 group-hover:scale-105"
          src={shopProduct.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4f2410]/18 via-transparent to-transparent" />
        {shopProduct.tag ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/40 bg-[#8f350f]/92 px-3 py-1 text-[10px] font-bold text-white shadow-lg shadow-[#7d2d0c]/20 backdrop-blur sm:left-4 sm:top-4 sm:px-3.5 sm:text-xs">
            <span className="material-symbols-outlined text-xs leading-none sm:text-sm">{shopProduct.tag.icon}</span>
            {shopProduct.tag.label}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3">
          <div className="mb-2 h-1.5 w-10 rounded-full bg-gradient-to-r from-[#8f350f] via-[#f0a15f] to-[#d8b266]" />
          <h3 className="mb-2 min-h-[2.8rem] font-headline text-base leading-tight text-[#4b2616] min-[400px]:text-[1.05rem] sm:min-h-[56px] sm:text-[1.45rem] sm:leading-[1.06]">
            {shopProduct.name}
          </h3>
          <p className="hidden min-h-[32px] text-[11px] leading-5 text-on-surface-variant/90 min-[400px]:block sm:text-sm sm:leading-5">
            {shopProduct.description}
          </p>
        </div>
        <div className="mt-auto">
          <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-1.5">
            {shopProduct.sizes.map((size) => (
              <button
                key={size}
                className="rounded-full border border-[#cda06f]/60 bg-white/55 px-2.5 py-1 text-[10px] font-semibold text-[#6f2507] transition-colors hover:bg-white/85 sm:px-3 sm:text-[11px]"
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/40 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f350f]">
              Spice blend
            </span>
            <span className="rounded-full bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#6f2507] shadow-sm">
              View details
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
