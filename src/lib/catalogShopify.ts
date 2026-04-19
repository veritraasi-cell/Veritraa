import 'server-only';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { listProductsWithDetails } from '@/lib/shopify/queries/products';
import type { ShopifyCatalogProduct, ShopifyProductVariant } from '@/lib/shopify/types';
import { shopCategories, shopProducts, type ShopProduct } from '@/src/data/mockData';

export type ManagedCatalogProduct = ShopProduct & {
  id: string;
  source?: 'shopify' | 'local';
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  vendor: string;
  productType: string;
  categoryName: string;
  tags: string[];
  price: string;
  quantity: number;
  variantDefinitions: Array<{
    label: string;
    price: string;
    quantity: number;
  }>;
  imageAlt?: string;
  descriptionHtml?: string;
  isPushed?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateCatalogProductInput = {
  slug?: string;
  shopifyHandle?: string;
  name: string;
  description: string;
  image: string;
  sizes: string[];
  highlights: string[];
  vendor?: string;
  productType?: string;
  categoryName?: string;
  tags?: string[];
  price?: string;
  quantity?: number;
  variantDefinitions?: Array<{
    label: string;
    price: string;
    quantity?: number;
  }>;
  imageAlt?: string;
  descriptionHtml?: string;
  tagLabel?: string;
  isPushed?: boolean;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function dedupeList(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWeightLabel(variant: ShopifyProductVariant) {
  return variant.selectedOptions.find((option) => option.name.toLowerCase() === 'weight')?.value ?? variant.title;
}

const loggedCatalogFallbackMessages = new Set<string>();

function logShopifyCatalogFallback(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const cacheKey = `${scope}:${message}`;

  if (loggedCatalogFallbackMessages.has(cacheKey)) {
    return;
  }

  loggedCatalogFallbackMessages.add(cacheKey);
  console.warn(`Shopify catalog unavailable for ${scope}; using local catalog fallback. ${message}`);
}

function inferLocalProductType(product: ShopProduct) {
  if (product.productType?.trim()) {
    return product.productType.trim();
  }

  if (product.categoryName?.trim() && product.categoryName !== 'All Collections') {
    return product.categoryName.trim();
  }

  if (product.name.toLowerCase().includes('chutney')) {
    return 'Relishes & Chutneys';
  }

  return 'Herbs & Spices';
}

function buildManagedCatalogProductFromShopify(product: ShopifyCatalogProduct): ManagedCatalogProduct {
  const variants = product.variants ?? [];
  const normalizedVariants = variants.map((variant) => ({
    label: getWeightLabel(variant),
    price: variant.price,
    quantity: variant.inventoryQuantity ?? product.totalInventory ?? 0,
  }));
  const primaryVariant = normalizedVariants[0];
  const featuredImage = product.featuredImage;
  const descriptionHtml = product.descriptionHtml ?? '';
  const description = stripHtml(descriptionHtml) || product.title;

  return {
    id: product.id,
    source: 'shopify',
    slug: product.handle,
    shopifyHandle: product.handle,
    name: product.title,
    description,
    image: featuredImage?.url ?? '/uploads/products/placeholder.png',
    sizes: normalizedVariants.map((variant) => variant.label),
    highlights: dedupeList(product.tags.filter((tag) => tag !== product.handle && tag !== product.title)),
    vendor: product.vendor,
    productType: product.productType,
    categoryName: product.productType || 'Herbs & Spices',
    tags: product.tags,
    price: primaryVariant?.price ?? '0.00',
    quantity: primaryVariant?.quantity ?? product.totalInventory ?? 0,
    variantDefinitions: normalizedVariants,
    imageAlt: featuredImage?.altText ?? product.title,
    descriptionHtml,
    status: product.status as ManagedCatalogProduct['status'],
    isPushed: product.status === 'ACTIVE',
    updatedAt: product.updatedAt,
  };
}

function buildManagedCatalogProductFromLocal(product: ShopProduct): ManagedCatalogProduct {
  const variantDefinitions =
    product.variantDefinitions?.length
      ? product.variantDefinitions.map((variant) => ({
          label: variant.label,
          price: variant.price,
          quantity: variant.quantity,
        }))
      : product.sizes.map((size) => ({
          label: size,
          price: product.price ?? '0.00',
          quantity: product.quantity ?? 20,
        }));
  const primaryVariant = variantDefinitions[0];
  const productType = inferLocalProductType(product);

  return {
    ...product,
    id: `local:${product.shopifyHandle ?? product.slug}`,
    source: 'local',
    shopifyHandle: product.shopifyHandle ?? product.slug,
    vendor: product.vendor?.trim() || 'Veritraa Enterprises',
    productType,
    categoryName: product.categoryName?.trim() || productType,
    tags: dedupeList(product.tags ?? ['veritraa', 'masala', product.slug]),
    price: product.price ?? primaryVariant?.price ?? '0.00',
    quantity: product.quantity ?? primaryVariant?.quantity ?? 20,
    variantDefinitions,
    imageAlt: product.imageAlt?.trim() || product.name,
    descriptionHtml: product.descriptionHtml?.trim() || undefined,
    status: 'ACTIVE',
    isPushed: true,
  };
}

function getFallbackCatalogProducts(options?: { liveOnly?: boolean }) {
  const products = shopProducts.map((product) => buildManagedCatalogProductFromLocal(product));

  if (options?.liveOnly) {
    return products.filter((product) => product.status === 'ACTIVE' && product.isPushed !== false);
  }

  return products;
}

async function listAllShopifyProductsWithDetails(options?: { query?: string | null }) {
  const products: ShopifyCatalogProduct[] = [];
  let after: string | null = null;

  do {
    const page = await listProductsWithDetails({ first: 100, after, query: options?.query ?? null });
    products.push(...page.nodes);
    after = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (after);

  return products;
}

const getCachedCatalogProducts = unstable_cache(
  async (): Promise<ManagedCatalogProduct[]> => {
    try {
      const products = await listAllShopifyProductsWithDetails();
      return products.map((product) => buildManagedCatalogProductFromShopify(product));
    } catch (error) {
      logShopifyCatalogFallback('catalog products', error);
      return getFallbackCatalogProducts();
    }
  },
  ['shopify-catalog-products'],
  { revalidate: 120, tags: ['shopify:products'] }
);

const getCachedLiveCatalogProducts = unstable_cache(
  async (): Promise<ManagedCatalogProduct[]> => {
    try {
      const products = await listAllShopifyProductsWithDetails({ query: 'status:active' });
      return products.map((product) => buildManagedCatalogProductFromShopify(product));
    } catch (error) {
      logShopifyCatalogFallback('live catalog products', error);
      return getFallbackCatalogProducts({ liveOnly: true });
    }
  },
  ['shopify-live-catalog-products'],
  { revalidate: 120, tags: ['shopify:products'] }
);

const getCachedCatalogProductBySlug = unstable_cache(
  async (slug: string): Promise<ManagedCatalogProduct | null> => {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug) {
      return null;
    }

    try {
      const products = await listProductsWithDetails({ first: 1, query: `handle:${normalizedSlug}` });
      const product = products.nodes[0];

      return product ? buildManagedCatalogProductFromShopify(product) : null;
    } catch (error) {
      logShopifyCatalogFallback(`catalog product "${normalizedSlug}"`, error);
      return (
        getFallbackCatalogProducts().find(
          (product) => product.slug === normalizedSlug || product.shopifyHandle === normalizedSlug
        ) ?? null
      );
    }
  },
  ['shopify-catalog-product-by-slug'],
  { revalidate: 120, tags: ['shopify:products'] }
);

const getRequestCachedCatalogProducts = cache(async (): Promise<ManagedCatalogProduct[]> => getCachedCatalogProducts());
const getRequestCachedLiveCatalogProducts = cache(async (): Promise<ManagedCatalogProduct[]> => getCachedLiveCatalogProducts());
const getRequestCachedCatalogProductBySlug = cache(async (slug: string) => getCachedCatalogProductBySlug(slug));

export async function listLiveCatalogProducts(): Promise<ManagedCatalogProduct[]> {
  return getRequestCachedLiveCatalogProducts();
}

export async function listCatalogProducts(cachedProducts?: ManagedCatalogProduct[]): Promise<ManagedCatalogProduct[]> {
  if (cachedProducts) {
    return cachedProducts;
  }

  return getRequestCachedCatalogProducts();
}

export async function getCatalogProductBySlug(slug: string, cachedProducts?: ManagedCatalogProduct[]) {
  if (cachedProducts) {
    return cachedProducts.find((product) => product.slug === slug || product.shopifyHandle === slug) ?? null;
  }

  const directMatch = await getRequestCachedCatalogProductBySlug(slug);

  if (directMatch) {
    return directMatch;
  }

  const products = await getRequestCachedCatalogProducts();
  return products.find((product) => product.slug === slug || product.shopifyHandle === slug) ?? null;
}

export async function getCustomCatalogProductBySlug(slug: string) {
  return getCatalogProductBySlug(slug);
}

export async function listCatalogCategories(cachedProducts?: ManagedCatalogProduct[]) {
  const products = cachedProducts ?? (await listCatalogProducts());
  const dynamicCategories = dedupeList(
    products.map((product) => product.categoryName ?? product.productType).filter(Boolean) as string[]
  );

  return dedupeList(['All Collections', ...shopCategories, ...dynamicCategories]);
}

export async function createCatalogProduct(input: CreateCatalogProductInput) {
  const slug = slugify(input.slug?.trim() || input.name);

  if (!slug) {
    throw new Error('A valid slug or title is required.');
  }

  const normalizedProductType = input.productType?.trim() || input.categoryName?.trim() || 'Herbs & Spices';
  const normalizedCategoryName = input.categoryName?.trim() || normalizedProductType;
  const normalizedQuantity =
    typeof input.quantity === 'number' && Number.isFinite(input.quantity) ? Math.max(0, Math.round(input.quantity)) : 20;
  const normalizedVariants =
    input.variantDefinitions?.length
      ? input.variantDefinitions
          .map((variant) => ({
            label: variant.label.trim(),
            price: variant.price.trim(),
            quantity:
              typeof variant.quantity === 'number' && Number.isFinite(variant.quantity)
                ? Math.max(0, Math.round(variant.quantity))
                : normalizedQuantity,
          }))
          .filter((variant) => variant.label && variant.price)
      : dedupeList(input.sizes).map((size) => ({
          label: size,
          price: input.price?.trim() || '45.00',
          quantity: normalizedQuantity,
        }));

  if (!normalizedVariants.length) {
    throw new Error('At least one weight and price is required.');
  }

  return {
    id: slug,
    source: 'shopify' as const,
    slug,
    shopifyHandle: input.shopifyHandle?.trim() || slug,
    name: input.name.trim(),
    description: input.description.trim(),
    image: input.image.trim(),
    sizes: normalizedVariants.map((variant) => variant.label),
    highlights: dedupeList(input.highlights),
    vendor: input.vendor?.trim() || 'Veritraa Enterprises',
    productType: normalizedProductType,
    categoryName: normalizedCategoryName,
    tags: dedupeList(input.tags ?? ['veritraa', 'masala']),
    price: normalizedVariants[0].price,
    quantity: normalizedQuantity,
    variantDefinitions: normalizedVariants,
    imageAlt: input.imageAlt?.trim() || input.name.trim(),
    descriptionHtml: input.descriptionHtml?.trim() || undefined,
    tag: input.tagLabel?.trim()
      ? {
          icon: 'workspace_premium',
          label: input.tagLabel.trim(),
        }
      : undefined,
    status: input.isPushed ? 'ACTIVE' : 'DRAFT',
    isPushed: Boolean(input.isPushed),
  } satisfies ManagedCatalogProduct;
}

export async function updateCatalogProduct(existingSlug: string, input: CreateCatalogProductInput) {
  const existingProduct = await getCatalogProductBySlug(existingSlug);

  if (!existingProduct) {
    throw new Error(`Catalog product "${existingSlug}" was not found.`);
  }

  const updatedQuantity =
    typeof input.quantity === 'number' && Number.isFinite(input.quantity)
      ? Math.max(0, Math.round(input.quantity))
      : existingProduct.quantity;

  const updatedVariants =
    input.variantDefinitions?.length
      ? input.variantDefinitions
          .map((variant) => ({
            label: variant.label.trim(),
            price: variant.price.trim(),
            quantity:
              typeof variant.quantity === 'number' && Number.isFinite(variant.quantity)
                ? Math.max(0, Math.round(variant.quantity))
                : updatedQuantity,
          }))
          .filter((variant) => variant.label && variant.price)
      : existingProduct.variantDefinitions;

  if (!updatedVariants.length) {
    throw new Error('At least one weight and price is required.');
  }

  return {
    ...existingProduct,
    name: input.name.trim(),
    description: input.description.trim(),
    image: input.image.trim(),
    sizes: updatedVariants.map((variant) => variant.label),
    highlights: dedupeList(input.highlights),
    vendor: input.vendor?.trim() || existingProduct.vendor,
    productType: input.productType?.trim() || existingProduct.productType,
    categoryName: input.categoryName?.trim() || existingProduct.categoryName,
    tags: dedupeList(input.tags ?? existingProduct.tags),
    price: input.price?.trim() || updatedVariants[0].price,
    quantity: updatedQuantity,
    variantDefinitions: updatedVariants,
    imageAlt: input.imageAlt?.trim() || existingProduct.imageAlt,
    descriptionHtml: input.descriptionHtml?.trim() || existingProduct.descriptionHtml,
    tag: input.tagLabel?.trim()
      ? {
          icon: 'workspace_premium',
          label: input.tagLabel.trim(),
        }
      : undefined,
    isPushed: existingProduct.status === 'ACTIVE',
  } satisfies ManagedCatalogProduct;
}

export async function deleteCustomCatalogProduct(_slug: string) {
  return true;
}

export async function listUnpushedCatalogProducts(cachedProducts?: ManagedCatalogProduct[]): Promise<ManagedCatalogProduct[]> {
  const products = cachedProducts ?? (await listCatalogProducts());
  return products.filter((product) => !product.isPushed);
}

export async function getPushedCatalogProducts(cachedProducts?: ManagedCatalogProduct[]): Promise<ManagedCatalogProduct[]> {
  const products = cachedProducts ?? (await listCatalogProducts());
  return products.filter((product) => product.isPushed);
}

export async function markProductAsPushed(slug: string) {
  const product = await getCatalogProductBySlug(slug);
  if (!product) {
    throw new Error(`Product with slug "${slug}" not found.`);
  }

  return {
    ...product,
    isPushed: true,
    status: 'ACTIVE' as const,
  } satisfies ManagedCatalogProduct;
}

export async function markAllProductsAsPushed() {
  const products = await listCatalogProducts();
  const markedCount = products.filter((product) => !product.isPushed).length;

  return { markedCount };
}
