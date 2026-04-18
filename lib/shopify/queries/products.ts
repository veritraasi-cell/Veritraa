import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type {
  ShopifyPageInfo,
  ShopifyProductDetail,
  ShopifyProductSummary,
  ShopifyProductVariant,
} from '@/lib/shopify/types';

interface ProductListQueryResponse {
  products: {
    nodes: ShopifyProductSummary[];
    pageInfo: ShopifyPageInfo;
  };
}

interface ProductDetailQueryResponse {
  product: (Omit<ShopifyProductDetail, 'media' | 'variants'> & {
    media: {
      nodes: ShopifyProductDetail['media'];
    };
    variants: {
      nodes: ShopifyProductVariant[];
    };
  }) | null;
}

function buildProductSearchQuery(searchText: string) {
  const trimmedSearchText = searchText.trim();
  if (!trimmedSearchText) {
    throw new Error('Product search query is required.');
  }

  if (/^gid:\/\/shopify\/Product\/\d+$/i.test(trimmedSearchText)) {
    return `id:${trimmedSearchText}`;
  }

  const terms = trimmedSearchText
    .split(/\s+/)
    .map((entry) => entry.trim().replace(/"/g, '\\"'))
    .filter(Boolean);

  if (!terms.length) {
    throw new Error('Product search query is required.');
  }

  return terms.map((term) => `(title:*${term}* OR handle:*${term}*)`).join(' AND ');
}

export async function listProducts(options: { first?: number; after?: string | null; query?: string | null } = {}) {
  const query = `
    query ProductList($first: Int!, $after: String, $query: String) {
      products(first: $first, after: $after, query: $query, reverse: true, sortKey: UPDATED_AT) {
        nodes {
          id
          title
          handle
          status
          totalInventory
          updatedAt
          featuredImage {
            url
            altText
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyGraphQL<ProductListQueryResponse>(query, {
    first: options.first ?? 25,
    after: options.after ?? null,
    query: options.query ?? null,
  });

  return data.products;
}

export async function getProduct(productId: string) {
  const query = `
    query ProductDetail($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        status
        vendor
        productType
        tags
        descriptionHtml
        featuredImage {
          url
          altText
        }
        media(first: 10) {
          nodes {
            id
            mediaContentType
            alt
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
        variants(first: 100) {
          nodes {
            id
            title
            price
            compareAtPrice
            inventoryQuantity
            inventoryItem {
              id
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<ProductDetailQueryResponse>(query, {
    id: productId,
  });

  if (!data.product) {
    throw new Error('Product not found.');
  }

  return {
    ...data.product,
    media: data.product.media.nodes,
    variants: data.product.variants.nodes,
  } satisfies ShopifyProductDetail;
}

export async function searchProducts(searchText: string) {
  const queryText = buildProductSearchQuery(searchText);
  return listProducts({ first: 12, query: queryText });
}

export { buildProductSearchQuery };
