export interface ShopifyPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyMoneySet {
  shopMoney: ShopifyMoney;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMediaImage {
  id: string;
  mediaContentType: string;
  alt: string | null;
  image: {
    url: string;
  } | null;
}

export interface ShopifyProductVariant {
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

export interface ShopifyProductSummary {
  id: string;
  title: string;
  handle: string;
  status: string;
  totalInventory: number;
  updatedAt: string;
  featuredImage: ShopifyImage | null;
}

export interface ShopifyProductDetail extends ShopifyProductSummary {
  vendor: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  media: ShopifyMediaImage[];
  variants: ShopifyProductVariant[];
}

export interface ShopifyCatalogProduct extends ShopifyProductSummary {
  vendor: string;
  productType: string;
  tags: string[];
  descriptionHtml: string;
  variants: ShopifyProductVariant[];
}

export interface ShopifyOrderCustomerSummary {
  displayName: string | null;
  email: string | null;
}

export interface ShopifyOrderCustomerDetail {
  id: string;
  displayName: string | null;
  email: string | null;
  phone: string | null;
}

export interface ShopifyOrderSummary {
  id: string;
  name: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string | null;
  createdAt: string;
  totalPriceSet: ShopifyMoneySet;
  customer: ShopifyOrderCustomerSummary | null;
}

export interface ShopifyOrderLineItem {
  title: string;
  quantity: number;
  originalTotalSet: ShopifyMoneySet;
}

export interface ShopifyOrderDetail extends ShopifyOrderSummary {
  tags: string[];
  note: string | null;
  customer: ShopifyOrderCustomerDetail | null;
  lineItems: ShopifyOrderLineItem[];
}

export interface ShopifyCustomerSummary {
  id: string;
  displayName: string | null;
  email: string | null;
  phone: string | null;
  state: string;
  numberOfOrders: number;
  amountSpent: ShopifyMoney | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface ShopifyCustomerDetail extends ShopifyCustomerSummary {
  firstName: string | null;
  lastName: string | null;
  note: string | null;
}

export interface ShopifyCollectionSummary {
  id: string;
  title: string;
  handle: string;
  updatedAt: string;
  productsCount: number;
  image: ShopifyImage | null;
}

export interface ShopifyCollectionDetail extends ShopifyCollectionSummary {
  descriptionHtml: string;
  products: ShopifyProductSummary[];
}

export interface ShopifyInventoryLevel {
  id: string;
  available: number | null;
  updatedAt: string | null;
  location: {
    id: string;
    name: string;
  };
  inventoryItem: {
    id: string;
    sku: string | null;
    tracked: boolean | null;
  };
}

export interface ShopifyShopIdentity {
  name: string;
  myshopifyDomain: string;
  currencyCode: string;
}

export interface ShopifyDashboardMetrics {
  shop: ShopifyShopIdentity;
  totalProducts: number;
  totalCustomers: number;
  todayOrdersCount: number;
  todayRevenue: number;
  recentOrders: ShopifyOrderSummary[];
}

export interface ShopifyUserError {
  field?: string[] | null;
  message: string;
}

export interface ShopifyMutationEnvelope<T> {
  data: T;
  userErrors: ShopifyUserError[];
}
