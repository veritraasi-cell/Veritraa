import 'server-only';

import { cache } from 'react';
import type { ShopProduct } from '@/src/data/mockData';
import type { ManagedCatalogProduct } from '@/src/lib/catalog';
import { listLiveCatalogProducts } from '@/src/lib/catalog';

// Use React's cache to memoize results within a request
const getCachedLiveProducts = cache(
  async (cachedProducts?: ManagedCatalogProduct[]): Promise<ShopProduct[]> => {
    try {
      const catalogProducts = cachedProducts ?? (await listLiveCatalogProducts());
      
      // Return only ACTIVE published products
      return catalogProducts.filter(
        (product) => product.isPushed !== false && product.status === 'ACTIVE'
      );
    } catch (error) {
      console.error('Error fetching live shop products:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }
);

export async function getLiveShopProducts(cachedProducts?: ManagedCatalogProduct[]): Promise<ShopProduct[]> {
  return getCachedLiveProducts(cachedProducts);
}

export async function isShopProductLive(slug: string, cachedProducts?: ManagedCatalogProduct[]) {
  const liveProducts = await getLiveShopProducts(cachedProducts);
  return liveProducts.some((product) => product.slug === slug);
}
