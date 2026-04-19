import 'server-only';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
const SHOPIFY_STOREFRONT_API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION?.trim() ?? '2026-04';

export interface ShopifyStorefrontMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyStorefrontImage {
  url: string;
  altText: string | null;
}

export interface ShopifyStorefrontVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: ShopifyStorefrontMoney;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ShopifyStorefrontProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: ShopifyStorefrontImage | null;
  variants: ShopifyStorefrontVariant[];
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: ShopifyStorefrontVariant & {
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage: ShopifyStorefrontImage | null;
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: ShopifyStorefrontMoney;
    totalAmount: ShopifyStorefrontMoney;
  };
  lines: ShopifyCartLine[];
}

export interface ShopifyStorefrontProductSummary {
  id: string;
  handle: string;
  title: string;
}

function assertStorefrontConfig() {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN in environment variables.');
  }

  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN in environment variables.');
  }
}

function getStorefrontUrl() {
  assertStorefrontConfig();
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
}

function getStorefrontTokenHeaderName() {
  if ((SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '').startsWith('shpat_')) {
    return 'Shopify-Storefront-Private-Token';
  }

  return 'X-Shopify-Storefront-Access-Token';
}

function formatStorefrontErrors(
  errors?: Array<{ message: string }>,
  userErrors?: Array<{ message: string }>
) {
  const messages = [
    ...(errors?.map((entry) => entry.message) ?? []),
    ...(userErrors?.map((entry) => entry.message) ?? []),
  ].filter(Boolean);

  return messages.join('; ');
}

async function storefrontGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(getStorefrontUrl(), {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      [getStorefrontTokenHeaderName()]: SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify Storefront request failed (${response.status} ${response.statusText}): ${body}`);
  }

  const payload = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  const errorMessage = formatStorefrontErrors(payload.errors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!payload.data) {
    throw new Error('Shopify Storefront API returned an empty response.');
  }

  return payload.data;
}

function normalizeProduct(
  product: {
    id: string;
    title: string;
    handle: string;
    description: string;
    featuredImage: ShopifyStorefrontImage | null;
    variants: {
      nodes: ShopifyStorefrontVariant[];
    };
  } | null
) {
  if (!product) {
    return null;
  }

  return {
    ...product,
    variants: product.variants.nodes,
  } satisfies ShopifyStorefrontProduct;
}

function normalizeCart(
  cart: {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
      subtotalAmount: ShopifyStorefrontMoney;
      totalAmount: ShopifyStorefrontMoney;
    };
    lines: {
      nodes: ShopifyCartLine[];
    };
  } | null
) {
  if (!cart) {
    return null;
  }

  return {
    ...cart,
    lines: cart.lines.nodes,
  } satisfies ShopifyCart;
}

const getCachedStorefrontProductByHandle = unstable_cache(
  async (handle: string) => {
    const normalizedHandle = handle.trim();

    if (!normalizedHandle) {
      return null;
    }

    const query = `
      query StorefrontProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          featuredImage {
            url
            altText
          }
          variants(first: 25) {
            nodes {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
                currencyCode
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

    const data = await storefrontGraphQL<{
      product: {
        id: string;
        title: string;
        handle: string;
        description: string;
        featuredImage: ShopifyStorefrontImage | null;
        variants: {
          nodes: ShopifyStorefrontVariant[];
        };
      } | null;
    }>(query, { handle: normalizedHandle });

    return normalizeProduct(data.product);
  },
  ['shopify-storefront-product-by-handle'],
  { revalidate: 60, tags: ['shopify:storefront-products'] }
);

const getRequestCachedStorefrontProductByHandle = cache(async (handle: string) => getCachedStorefrontProductByHandle(handle));

export async function getStorefrontProductByHandle(handle: string) {
  return getRequestCachedStorefrontProductByHandle(handle);
}

export async function createCart(lines: Array<{ merchandiseId: string; quantity: number }>) {
  const mutation = `
    mutation CreateCart($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await storefrontGraphQL<{
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          subtotalAmount: ShopifyStorefrontMoney;
          totalAmount: ShopifyStorefrontMoney;
        };
        lines: {
          nodes: ShopifyCartLine[];
        };
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, { lines });

  const errorMessage = formatStorefrontErrors(undefined, data.cartCreate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return normalizeCart(data.cartCreate.cart);
}

export async function getCart(cartId: string) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          subtotalAmount {
            amount
            currencyCode
          }
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          nodes {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                product {
                  id
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await storefrontGraphQL<{
    cart: {
      id: string;
      checkoutUrl: string;
      totalQuantity: number;
      cost: {
        subtotalAmount: ShopifyStorefrontMoney;
        totalAmount: ShopifyStorefrontMoney;
      };
      lines: {
        nodes: ShopifyCartLine[];
      };
    } | null;
  }>(query, { cartId });

  return normalizeCart(data.cart);
}

export async function addCartLines(cartId: string, lines: Array<{ merchandiseId: string; quantity: number }>) {
  const mutation = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await storefrontGraphQL<{
    cartLinesAdd: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          subtotalAmount: ShopifyStorefrontMoney;
          totalAmount: ShopifyStorefrontMoney;
        };
        lines: {
          nodes: ShopifyCartLine[];
        };
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, { cartId, lines });

  const errorMessage = formatStorefrontErrors(undefined, data.cartLinesAdd.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return normalizeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number; merchandiseId?: string }>
) {
  const mutation = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await storefrontGraphQL<{
    cartLinesUpdate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          subtotalAmount: ShopifyStorefrontMoney;
          totalAmount: ShopifyStorefrontMoney;
        };
        lines: {
          nodes: ShopifyCartLine[];
        };
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, { cartId, lines });

  const errorMessage = formatStorefrontErrors(undefined, data.cartLinesUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]) {
  const mutation = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 50) {
            nodes {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          message
        }
      }
    }
  `;

  const data = await storefrontGraphQL<{
    cartLinesRemove: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          subtotalAmount: ShopifyStorefrontMoney;
          totalAmount: ShopifyStorefrontMoney;
        };
        lines: {
          nodes: ShopifyCartLine[];
        };
      } | null;
      userErrors: Array<{ message: string }>;
    };
  }>(mutation, { cartId, lineIds });

  const errorMessage = formatStorefrontErrors(undefined, data.cartLinesRemove.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return normalizeCart(data.cartLinesRemove.cart);
}
