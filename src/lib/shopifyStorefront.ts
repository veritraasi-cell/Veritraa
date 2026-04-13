import 'server-only';

import type { ShopProduct } from '@/src/data/mockData';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

export function getShopifyProductUrl(product: Pick<ShopProduct, 'slug'> & { shopifyHandle?: string }) {
  if (!SHOPIFY_STORE_DOMAIN) {
    return null;
  }

  const handle = product.shopifyHandle ?? product.slug;
  return `https://${SHOPIFY_STORE_DOMAIN}/products/${handle}`;
}

