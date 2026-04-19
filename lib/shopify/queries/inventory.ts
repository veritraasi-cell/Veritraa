import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type { ShopifyInventoryLevel, ShopifyPageInfo } from '@/lib/shopify/types';

interface InventoryLevelsQueryResponse {
  inventoryLevels: {
    nodes: Array<{
      id: string;
      available: number | null;
      updatedAt: string | null;
      location: {
        id: string;
        name: string;
      };
      item: {
        id: string;
        sku: string | null;
        tracked: boolean | null;
      };
    }>;
    pageInfo: ShopifyPageInfo;
  };
}

export async function listInventoryLevels(options: { first?: number; after?: string | null; query?: string | null } = {}) {
  const query = `
    query InventoryLevels($first: Int!, $after: String, $query: String) {
      inventoryLevels(first: $first, after: $after, query: $query) {
        nodes {
          id
          available
          updatedAt
          location {
            id
            name
          }
          item {
            id
            sku
            tracked
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyGraphQL<InventoryLevelsQueryResponse>(query, {
    first: options.first ?? 50,
    after: options.after ?? null,
    query: options.query ?? null,
  });

  return {
    nodes: data.inventoryLevels.nodes.map((entry) => ({
      id: entry.id,
      available: entry.available,
      updatedAt: entry.updatedAt,
      location: entry.location,
      inventoryItem: entry.item,
    })) satisfies ShopifyInventoryLevel[],
    pageInfo: data.inventoryLevels.pageInfo,
  };
}
