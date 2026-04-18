import 'server-only';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION?.trim() ?? '2026-04';

function assertShopifyConfig() {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error('Missing SHOPIFY_STORE_DOMAIN in environment variables.');
  }

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    throw new Error('Missing SHOPIFY_ADMIN_ACCESS_TOKEN in environment variables.');
  }
}

function buildShopifyGraphqlUrl() {
  assertShopifyConfig();
  return `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

function buildShopifyRestUrl(path: string) {
  assertShopifyConfig();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}${normalizedPath}`;
}

type ShopifyFetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export async function shopifyGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: ShopifyFetchOptions
): Promise<T> {
  const cacheMode =
    options?.cache ?? (typeof options?.revalidate === 'number' ? 'force-cache' : 'no-store');

  const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    method: 'POST',
    cache: cacheMode,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (typeof options?.revalidate === 'number' || (options?.tags && options.tags.length)) {
    init.next = {
      revalidate: options?.revalidate,
      tags: options?.tags,
    };
  }

  const response = await fetch(buildShopifyGraphqlUrl(), init);

  if (!response.ok) {
    const body = await response.text();

    if (response.status === 401) {
      throw new Error(
        [
          `Shopify Admin authentication failed for ${SHOPIFY_STORE_DOMAIN} (${response.status} ${response.statusText}).`,
          'The request format is correct, so this usually means the Admin API token is revoked, belongs to a different store, or the app was reconfigured and needs a fresh token.',
          'Check that SHOPIFY_STORE_DOMAIN is the exact *.myshopify.com domain for the store that created this token, then regenerate/reveal the Admin API access token in Shopify and restart the dev server.',
        ].join(' ')
      );
    }

    throw new Error(`Shopify API request failed (${response.status} ${response.statusText}): ${body}`);
  }

  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((entry) => entry.message).join('; '));
  }

  if (!payload.data) {
    throw new Error('Shopify API returned an empty response.');
  }

  return payload.data;
}

export async function shopifyRest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildShopifyRestUrl(path), {
    cache: 'no-store',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN as string,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify REST request failed (${response.status} ${response.statusText}): ${body}`);
  }

  return (await response.json()) as T;
}

export function getShopifyStoreDomain() {
  assertShopifyConfig();
  return SHOPIFY_STORE_DOMAIN as string;
}

export function getShopifyApiVersion() {
  return SHOPIFY_API_VERSION;
}
