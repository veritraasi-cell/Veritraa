import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type { ShopifyCollectionDetail, ShopifyCollectionSummary, ShopifyPageInfo } from '@/lib/shopify/types';

interface CollectionListQueryResponse {
  collections: {
    nodes: Array<Omit<ShopifyCollectionSummary, 'productsCount'> & {
      productsCount: {
        count: number;
      };
    }>;
    pageInfo: ShopifyPageInfo;
  };
}

interface CollectionDetailQueryResponse {
  collection: (Omit<ShopifyCollectionDetail, 'products' | 'productsCount'> & {
    productsCount: {
      count: number;
    };
    products: {
      nodes: ShopifyCollectionDetail['products'];
    };
  }) | null;
}

export async function listCollections(options: { first?: number; after?: string | null; query?: string | null } = {}) {
  const query = `
    query CollectionList($first: Int!, $after: String, $query: String) {
      collections(first: $first, after: $after, query: $query, reverse: true) {
        nodes {
          id
          title
          handle
          updatedAt
          productsCount {
            count
          }
          image {
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

  const data = await shopifyGraphQL<CollectionListQueryResponse>(query, {
    first: options.first ?? 25,
    after: options.after ?? null,
    query: options.query ?? null,
  });

  return {
    nodes: data.collections.nodes.map((collection) => ({
      ...collection,
      productsCount: collection.productsCount.count,
    })),
    pageInfo: data.collections.pageInfo,
  };
}

export async function getCollection(collectionId: string) {
  const query = `
    query CollectionDetail($id: ID!) {
      collection(id: $id) {
        id
        title
        handle
        updatedAt
        descriptionHtml
        productsCount {
          count
        }
        image {
          url
          altText
        }
        products(first: 50) {
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
        }
      }
    }
  `;

  const data = await shopifyGraphQL<CollectionDetailQueryResponse>(query, {
    id: collectionId,
  });

  if (!data.collection) {
    throw new Error('Collection not found.');
  }

  return {
    ...data.collection,
    products: data.collection.products.nodes,
    productsCount: data.collection.productsCount.count,
  } satisfies ShopifyCollectionDetail;
}
