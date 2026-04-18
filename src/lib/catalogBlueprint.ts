import 'server-only';

import type { ManagedCatalogProduct } from '@/src/lib/catalog';
import { productPricingBySlug } from '@/src/data/catalogPricing';
import { getCatalogProductBySlug, listCatalogProducts } from '@/src/lib/catalog';

export type CatalogBlueprint = {
  slug: string;
  handle: string;
  title: string;
  descriptionHtml: string;
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
  imagePath: string;
  imageAlt?: string;
  status: 'ACTIVE';
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inferProductType(title: string) {
  if (title.toLowerCase().includes('chutney')) {
    return 'Relishes & Chutneys';
  }

  return 'Herbs & Spices';
}

function buildDescriptionHtml(product: ManagedCatalogProduct) {
  if (product.descriptionHtml?.trim()) {
    return product.descriptionHtml;
  }

  const highlights = product.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join('');

  return [
    `<p>${escapeHtml(product.description)}</p>`,
    `<p>Available pack sizes: ${escapeHtml(product.sizes.join(', '))}</p>`,
    `<ul>${highlights}</ul>`,
  ].join('');
}

export function buildCatalogBlueprintFromProduct(product: ManagedCatalogProduct): CatalogBlueprint {
  return {
    slug: product.slug,
    handle: product.shopifyHandle ?? product.slug,
    title: product.name,
    descriptionHtml: buildDescriptionHtml(product),
    vendor: product.vendor ?? 'Veritraa Enterprises',
    productType: product.productType ?? inferProductType(product.name),
    categoryName: product.categoryName ?? product.productType ?? inferProductType(product.name),
    tags: product.tags ?? ['veritraa', 'masala', ...product.highlights.map((highlight) => highlight.toLowerCase())],
    price: product.price ?? productPricingBySlug[product.slug]?.basePrice ?? '45.00',
    quantity: product.quantity ?? 20,
    variantDefinitions: product.variantDefinitions ?? productPricingBySlug[product.slug]?.variantDefinitions ?? [],
    imagePath: product.image,
    imageAlt: product.imageAlt ?? product.name,
    status: 'ACTIVE',
  };
}

export async function getCatalogBlueprintBySlug(slug: string, cachedProducts?: ManagedCatalogProduct[]): Promise<CatalogBlueprint | null> {
  const product = await getCatalogProductBySlug(slug, cachedProducts);

  if (!product) {
    return null;
  }

  return buildCatalogBlueprintFromProduct(product);
}

export async function listCatalogBlueprints(cachedProducts?: ManagedCatalogProduct[]) {
  const products = cachedProducts ?? (await listCatalogProducts());
  const blueprints = await Promise.all(products.map((product) => getCatalogBlueprintBySlug(product.slug, products)));
  return blueprints.filter(Boolean) as CatalogBlueprint[];
}
