import 'server-only';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2026-04';

export interface AdminProduct {
  id: string;
  title: string;
  status: string;
  totalInventory: number;
  updatedAt: string;
}

export interface AdminOrder {
  id: string;
  name: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string | null;
  createdAt: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  customer: {
    displayName: string | null;
    email: string | null;
  } | null;
}

export interface ShopifyAdminDashboardData {
  shopName: string;
  myshopifyDomain: string;
  currencyCode: string;
  productsCount: number;
  ordersCount: number;
  productVariantsCount: number;
  recentProducts: AdminProduct[];
  recentOrders: AdminOrder[];
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

interface DashboardQueryResponse {
  shop: {
    name: string;
    myshopifyDomain: string;
    currencyCode: string;
  };
  productsCount: {
    count: number;
  };
  ordersCount: {
    count: number;
  };
  productVariantsCount: {
    count: number;
  };
  products: {
    nodes: AdminProduct[];
  };
  orders: {
    nodes: AdminOrder[];
  };
}

function getConfigError(): string | null {
  if (!SHOPIFY_STORE_DOMAIN) {
    return 'Missing SHOPIFY_STORE_DOMAIN in .env.local.';
  }

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return 'Missing SHOPIFY_ADMIN_ACCESS_TOKEN in .env.local.';
  }

  return null;
}

async function shopifyGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const configError = getConfigError();
  if (configError) {
    throw new Error(configError);
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN as string,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Shopify API request failed (${response.status} ${response.statusText}): ${body}`
    );
  }

  const result = (await response.json()) as GraphqlResponse<T>;

  if (result.errors?.length) {
    throw new Error(result.errors.map((entry) => entry.message).join('; '));
  }

  if (!result.data) {
    throw new Error('Shopify API returned an empty response.');
  }

  return result.data;
}

export async function getShopifyAdminDashboardData(): Promise<ShopifyAdminDashboardData> {
  const query = `
    query AdminDashboardQuery {
      shop {
        name
        myshopifyDomain
        currencyCode
      }
      productsCount {
        count
      }
      ordersCount(query: "status:any") {
        count
      }
      productVariantsCount {
        count
      }
      products(first: 6, reverse: true, sortKey: UPDATED_AT) {
        nodes {
          id
          title
          status
          totalInventory
          updatedAt
        }
      }
      orders(first: 6, reverse: true, sortKey: PROCESSED_AT) {
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

  const data = await shopifyGraphql<DashboardQueryResponse>(query);

  return {
    shopName: data.shop.name,
    myshopifyDomain: data.shop.myshopifyDomain,
    currencyCode: data.shop.currencyCode,
    productsCount: data.productsCount.count,
    ordersCount: data.ordersCount.count,
    productVariantsCount: data.productVariantsCount.count,
    recentProducts: data.products.nodes,
    recentOrders: data.orders.nodes,
  };
}

export function validateShopifyAdminConfig() {
  return {
    hasStoreDomain: Boolean(SHOPIFY_STORE_DOMAIN),
    hasAdminToken: Boolean(SHOPIFY_ADMIN_ACCESS_TOKEN),
    apiVersion: SHOPIFY_API_VERSION,
  };
}
