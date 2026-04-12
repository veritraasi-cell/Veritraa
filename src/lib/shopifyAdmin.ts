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

export interface ProductVariantDetail {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  inventoryQuantity: number | null;
  inventoryItem: {
    id: string;
  } | null;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProductDetail {
  id: string;
  title: string;
  handle: string;
  status: string;
  vendor: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  media: Array<{
    id: string;
    mediaContentType: string;
    alt: string | null;
    image: {
      url: string;
    } | null;
  }>;
  variants: ProductVariantDetail[];
}

export interface OrderDetail {
  id: string;
  name: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string | null;
  createdAt: string;
  tags: string[];
  note: string | null;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  customer: {
    id: string;
    displayName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  lineItems: Array<{
    title: string;
    quantity: number;
    originalTotalSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
  }>;
}

export interface CustomerDetail {
  id: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  state: string;
  tags: string[];
  note: string | null;
  createdAt: string;
  updatedAt: string;
  amountSpent: {
    amount: string;
    currencyCode: string;
  } | null;
  numberOfOrders: number;
}

export interface ShopifyLocation {
  id: string;
  name: string;
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

interface ProductDetailQueryResponse {
  product: ProductDetail | null;
}

interface OrderDetailQueryResponse {
  order: OrderDetail | null;
}

interface CustomerDetailQueryResponse {
  customer: CustomerDetail | null;
}

interface LocationsQueryResponse {
  locations: {
    nodes: ShopifyLocation[];
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

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
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

export async function getShopifyProductDetail(productId: string): Promise<ProductDetail> {
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

  const data = await shopifyGraphql<ProductDetailQueryResponse>(query, {
    id: productId,
  });

  if (!data.product) {
    throw new Error('Product not found.');
  }

  return data.product;
}

export async function getShopifyOrderDetail(orderId: string): Promise<OrderDetail> {
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

  const data = await shopifyGraphql<OrderDetailQueryResponse>(query, {
    id: orderId,
  });

  if (!data.order) {
    throw new Error('Order not found.');
  }

  return data.order;
}

export async function getShopifyCustomerDetail(customerId: string): Promise<CustomerDetail> {
  const query = `
    query CustomerDetail($id: ID!) {
      customer(id: $id) {
        id
        displayName
        firstName
        lastName
        email
        phone
        state
        tags
        note
        createdAt
        updatedAt
        amountSpent {
          amount
          currencyCode
        }
        numberOfOrders
      }
    }
  `;

  const data = await shopifyGraphql<CustomerDetailQueryResponse>(query, {
    id: customerId,
  });

  if (!data.customer) {
    throw new Error('Customer not found.');
  }

  return data.customer;
}

export async function getShopifyLocations(): Promise<ShopifyLocation[]> {
  const query = `
    query LocationsQuery {
      locations(first: 10) {
        nodes {
          id
          name
        }
      }
    }
  `;

  const data = await shopifyGraphql<LocationsQueryResponse>(query);
  return data.locations.nodes;
}

export async function bulkUpdateProductVariants(
  productId: string,
  variants: Array<{ id: string; price?: string; compareAtPrice?: string | null }>
) {
  const mutation = `
    mutation BulkUpdateProductVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    productVariantsBulkUpdate: {
      product: { id: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    productId,
    variants,
  });

  const errorMessage = formatUserErrors(data.productVariantsBulkUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.productVariantsBulkUpdate.product;
}

export async function createShopifyProduct(input: {
  title: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  tags?: string[];
  price?: string;
  media?: Array<{
    alt?: string;
    originalSource: string;
  }>;
}) {
  const mutation = `
    mutation CreateShopifyProduct($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product {
          id
          variants(first: 1) {
            nodes {
              id
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    productCreate: {
      product: {
        id: string;
        variants: { nodes: Array<{ id: string }> };
      } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    product: {
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      vendor: input.vendor,
      productType: input.productType,
      status: input.status ?? 'DRAFT',
      tags: input.tags,
    },
    media: input.media?.map((entry) => ({
      alt: entry.alt,
      originalSource: entry.originalSource,
      mediaContentType: 'IMAGE',
    })),
  });

  const errorMessage = formatUserErrors(data.productCreate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const product = data.productCreate.product;
  if (!product) {
    throw new Error('Product creation failed.');
  }

  if (input.price && product.variants.nodes[0]?.id) {
    await bulkUpdateProductVariants(product.id, [
      {
        id: product.variants.nodes[0].id,
        price: input.price,
      },
    ]);
  }

  return product;
}

export async function addProductImage(
  productId: string,
  image: { originalSource: string; alt?: string }
) {
  const mutation = `
    mutation AddProductImage($product: ProductUpdateInput!, $media: [CreateMediaInput!]) {
      productUpdate(product: $product, media: $media) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    productUpdate: {
      product: { id: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    product: {
      id: productId,
    },
    media: [
      {
        originalSource: image.originalSource,
        alt: image.alt,
        mediaContentType: 'IMAGE',
      },
    ],
  });

  const errorMessage = formatUserErrors(data.productUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.productUpdate.product;
}

export async function deleteShopifyProduct(productId: string) {
  const mutation = `
    mutation DeleteShopifyProduct($input: ProductDeleteInput!, $synchronous: Boolean) {
      productDelete(input: $input, synchronous: $synchronous) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    productDelete: {
      deletedProductId: string | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      id: productId,
    },
    synchronous: true,
  });

  const errorMessage = formatUserErrors(data.productDelete.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.productDelete.deletedProductId;
}

export async function setInventoryQuantity(input: {
  inventoryItemId: string;
  locationId: string;
  quantity: number;
}) {
  const mutation = `
    mutation SetInventoryQuantity($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup {
          createdAt
          reason
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    inventorySetQuantities: {
      inventoryAdjustmentGroup: {
        createdAt: string;
        reason: string;
      } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      name: 'available',
      reason: 'correction',
      ignoreCompareQuantity: true,
      quantities: [
        {
          inventoryItemId: input.inventoryItemId,
          locationId: input.locationId,
          quantity: input.quantity,
        },
      ],
    },
  });

  const errorMessage = formatUserErrors(data.inventorySetQuantities.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.inventorySetQuantities.inventoryAdjustmentGroup;
}

export async function updateShopifyOrder(input: {
  orderId: string;
  email?: string;
  tags?: string[];
}) {
  const mutation = `
    mutation UpdateShopifyOrder($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    orderUpdate: {
      order: { id: string; name: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      id: input.orderId,
      email: input.email,
      tags: input.tags,
    },
  });

  const errorMessage = formatUserErrors(data.orderUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.orderUpdate.order;
}

export async function updateShopifyCustomer(input: {
  customerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
}) {
  const mutation = `
    mutation UpdateShopifyCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          displayName
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphql<{
    customerUpdate: {
      customer: { id: string; displayName: string | null } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      id: input.customerId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      tags: input.tags,
    },
  });

  const errorMessage = formatUserErrors(data.customerUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.customerUpdate.customer;
}

export function validateShopifyAdminConfig() {
  return {
    hasStoreDomain: Boolean(SHOPIFY_STORE_DOMAIN),
    hasAdminToken: Boolean(SHOPIFY_ADMIN_ACCESS_TOKEN),
    apiVersion: SHOPIFY_API_VERSION,
  };
}
