import Link from 'next/link';
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
      <div className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-outline-variant/35 bg-surface-container-lowest shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 sm:rounded-2xl">
        <div className="relative aspect-[5/6] w-full overflow-hidden bg-surface-container-low sm:aspect-[3/4]">
          <img
            alt={shopProduct.name}
            className="h-full w-full object-contain"
            src={shopProduct.image}
          />
          {shopProduct.tag ? (
            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-tertiary px-2 py-1 text-[10px] font-bold text-on-tertiary shadow sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
              <span className="material-symbols-outlined text-xs leading-none sm:text-sm">{shopProduct.tag.icon}</span>
              {shopProduct.tag.label}
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <div className="mb-2 sm:mb-3">
            <h3 className="mb-1 min-h-[2.5rem] font-headline text-sm leading-tight text-on-background min-[400px]:text-base sm:min-h-[48px] sm:text-xl sm:leading-[1.05]">
              {shopProduct.name}
            </h3>
            <p className="hidden text-[11px] leading-4 text-on-surface-variant opacity-70 min-[400px]:block sm:text-sm sm:leading-5">
              {shopProduct.description}
            </p>
          </div>
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <span className="font-headline text-base leading-none text-on-background min-[400px]:text-lg sm:text-2xl">
                {shopProduct.price}
              </span>
              <Link
                href="/shop"
                className="spice-gradient rounded-full p-2 text-on-primary shadow-lg shadow-primary/15 transition-transform hover:scale-105 sm:p-3"
              >
                <span className="material-symbols-outlined block text-base leading-none sm:text-xl">add_shopping_cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    const featuredProduct = product as FeaturedProduct;

    return (
      <div className="group w-full min-w-0">
        <div className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-primary/10">
          <div className="relative aspect-square">
            <img
              alt={featuredProduct.name}
              className="h-full w-full object-cover"
              src={featuredProduct.image}
            />
            {featuredProduct.badge ? (
              <span className="absolute left-4 top-4 rounded-full bg-tertiary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                {featuredProduct.badge}
              </span>
            ) : null}
          </div>
          <div className="p-5 sm:p-6">
            <div className="mb-2 flex items-center gap-1">
              {renderStars(featuredProduct.rating)}
              <span className="ml-1 text-xs text-on-surface-variant">{featuredProduct.reviews}</span>
            </div>
            <h3 className="mb-1 font-headline text-lg">{featuredProduct.name}</h3>
            <p className="font-bold text-primary">{featuredProduct.price}</p>
            <button className="mt-4 w-full rounded-full border border-primary/60 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-white">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shopProduct = product as ShopProduct;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.15rem] border border-outline-variant/35 bg-surface-container-lowest shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 sm:rounded-2xl">
      <div className="relative aspect-[5/6] w-full overflow-hidden bg-surface-container-low sm:aspect-[3/4]">
        <img
          alt={shopProduct.name}
          className="h-full w-full object-contain"
          src={shopProduct.image}
        />
        {shopProduct.tag ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-tertiary px-2 py-1 text-[10px] font-bold text-on-tertiary shadow sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
            <span className="material-symbols-outlined text-xs leading-none sm:text-sm">{shopProduct.tag.icon}</span>
            {shopProduct.tag.label}
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-2 sm:mb-3">
          <h3 className="mb-1 min-h-[2.5rem] font-headline text-sm leading-tight text-on-background min-[400px]:text-base sm:min-h-[56px] sm:text-[1.45rem] sm:leading-[1.06]">
            {shopProduct.name}
          </h3>
          <p className="hidden min-h-[32px] text-[11px] leading-4 text-on-surface-variant opacity-75 min-[400px]:block sm:text-sm sm:leading-5">
            {shopProduct.description}
          </p>
        </div>
        <div className="mt-auto">
          <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-1.5">
            {shopProduct.sizes.map((size) => (
              <button
                key={size}
                className="rounded-md border border-outline-variant/35 bg-surface px-2 py-1 text-[10px] font-label text-on-surface transition-colors hover:bg-surface-container-high sm:rounded-lg sm:px-2.5 sm:text-[11px]"
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-headline text-base leading-none text-on-background min-[400px]:text-lg sm:text-[1.85rem]">
              {shopProduct.price}
            </span>
            <button className="spice-gradient rounded-full p-2 text-on-primary shadow-lg shadow-primary/15 transition-transform hover:scale-105 sm:p-3">
              <span className="material-symbols-outlined block text-base leading-none sm:text-xl">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
