import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type {
  ShopifyOrderDetail,
  ShopifyOrderLineItem,
  ShopifyOrderSummary,
  ShopifyPageInfo,
} from '@/lib/shopify/types';

interface OrderListQueryResponse {
  orders: {
    nodes: ShopifyOrderSummary[];
    pageInfo: ShopifyPageInfo;
  };
}

interface OrderDetailQueryResponse {
  order: (Omit<ShopifyOrderDetail, 'lineItems'> & {
    lineItems: {
      nodes: ShopifyOrderLineItem[];
    };
  }) | null;
}

export async function listOrders(options: { first?: number; after?: string | null; query?: string | null } = {}) {
  const query = `
    query OrderList($first: Int!, $after: String, $query: String) {
      orders(first: $first, after: $after, query: $query, reverse: true, sortKey: PROCESSED_AT) {
        nodes {
          id
          name
          displayFinancialStatus
          displayFulfillmentStatus
          createdAt
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            displayName
            email
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyGraphQL<OrderListQueryResponse>(query, {
    first: options.first ?? 25,
    after: options.after ?? null,
    query: options.query ?? null,
  });

  return data.orders;
}

export async function getOrder(orderId: string) {
  const query = `
    query OrderDetail($id: ID!) {
      order(id: $id) {
        id
        name
        displayFinancialStatus
        displayFulfillmentStatus
        createdAt
        tags
        note
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          email
          phone
        }
        lineItems(first: 10) {
          nodes {
            title
            quantity
            originalTotalSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<OrderDetailQueryResponse>(query, {
    id: orderId,
  });

  if (!data.order) {
    throw new Error('Order not found.');
  }

  return {
    ...data.order,
    lineItems: data.order.lineItems.nodes,
  } satisfies ShopifyOrderDetail;
}
