import 'server-only';

import type { ShopProduct } from '@/src/data/mockData';
import type { ManagedCatalogProduct } from '@/src/lib/catalog';
import { listCatalogProducts } from '@/src/lib/catalog';
import { listStorefrontProductHandles } from '@/src/lib/shopifyStorefront';

export async function getLiveShopProducts(cachedProducts?: ManagedCatalogProduct[]): Promise<ShopProduct[]> {
  const liveHandles = new Set(await listStorefrontProductHandles());
  const catalogProducts = cachedProducts ?? (await listCatalogProducts());

  return catalogProducts.filter(
    (product) =>
      (product.isPushed !== false) && 
      liveHandles.has(product.shopifyHandle ?? product.slug)
  );
}

export async function isShopProductLive(slug: string, cachedProducts?: ManagedCatalogProduct[]) {
  const liveProducts = await getLiveShopProducts(cachedProducts);
  return liveProducts.some((product) => product.slug === slug);
}
