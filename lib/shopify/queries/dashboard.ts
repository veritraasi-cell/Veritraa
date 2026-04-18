import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type { ShopifyDashboardMetrics, ShopifyOrderSummary } from '@/lib/shopify/types';

interface DashboardQueryResponse {
  shop: {
    name: string;
    myshopifyDomain: string;
    currencyCode: string;
  };
  productsCount: {
    count: number;
  };
  customersCount: {
    count: number;
  };
  todayOrders: {
    nodes: Array<{
      totalPriceSet: {
        shopMoney: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  recentOrders: {
    nodes: ShopifyOrderSummary[];
  };
}

function formatKolkataDate(value: Date) {
  return value.toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata',
  });
}

export async function getAdminDashboardMetrics(): Promise<ShopifyDashboardMetrics> {
  const today = formatKolkataDate(new Date());

  const query = `
    query AdminDashboardMetrics($todayQuery: String!) {
      shop {
        name
        myshopifyDomain
        currencyCode
      }
      productsCount {
        count
      }
      customersCount {
        count
      }
      todayOrders: orders(first: 100, query: $todayQuery, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
      recentOrders: orders(first: 10, reverse: true, sortKey: PROCESSED_AT) {
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
      }
    }
  `;

  const data = await shopifyGraphQL<DashboardQueryResponse>(query, {
    todayQuery: `created_at:>=${today}`,
  });

  const todayRevenue = data.todayOrders.nodes.reduce((sum, order) => sum + Number(order.totalPriceSet.shopMoney.amount || 0), 0);

  return {
    shop: {
      name: data.shop.name,
      myshopifyDomain: data.shop.myshopifyDomain,
      currencyCode: data.shop.currencyCode,
    },
    totalProducts: data.productsCount.count,
    totalCustomers: data.customersCount.count,
    todayOrdersCount: data.todayOrders.nodes.length,
    todayRevenue,
    recentOrders: data.recentOrders.nodes,
  };
}
