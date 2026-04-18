import 'server-only';

import { addProductImage } from '@/lib/shopify/mutations/catalog';
import { activateInventoryAtLocation, setInventoryQuantity, updateInventoryTracking } from '@/lib/shopify/mutations/inventory';
import { setProductWeightVariants } from '@/lib/shopify/mutations/product-set';
import { createProduct, updateProduct } from '@/lib/shopify/mutations/products';
import { publishProductToChannels } from '@/lib/shopify/mutations/publications';
import { listLocations } from '@/lib/shopify/queries/locations';
import { listProducts } from '@/lib/shopify/queries/products';
import { listPublications } from '@/lib/shopify/queries/publications';
import { resolveTaxonomyCategoryId } from '@/lib/shopify/queries/taxonomy';
import { buildCatalogBlueprintFromProduct, getCatalogBlueprintBySlug } from '@/src/lib/catalogBlueprint';
import type { ManagedCatalogProduct } from '@/src/lib/catalog';

const REQUIRED_PUBLICATION_NAMES = [
  'Online Store',
  'Point of Sale',
  'Buy Button',
] as const;

function findRequiredPublicationIds(publications: Awaited<ReturnType<typeof listPublications>>) {
  const publicationIds = [
    ...REQUIRED_PUBLICATION_NAMES.map((publicationName) => {
      const publication = publications.find(
        (entry) => entry.name.trim().toLowerCase() === publicationName.toLowerCase()
      );

      return publication?.id ?? null;
    }),
  ];

  const headlessPublication = publications.find((publication) => publication.name.toLowerCase().includes('headless'));
  publicationIds.push(headlessPublication?.id ?? null);

  const missingPublications = [
    ...REQUIRED_PUBLICATION_NAMES.filter(
      (publicationName) =>
        !publications.some((entry) => entry.name.trim().toLowerCase() === publicationName.toLowerCase())
    ),
    ...(headlessPublication ? [] : ['Headless']),
  ];

  if (missingPublications.length) {
    throw new Error(`Missing Shopify publications: ${missingPublications.join(', ')}.`);
  }

  return publicationIds.filter(Boolean) as string[];
}

function normalizeProductImageSource(imagePath: string) {
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

async function ensureInventoryReady(input: {
  inventoryItemId: string;
  locationId: string;
  quantity: number;
}) {
  await updateInventoryTracking({
    inventoryItemId: input.inventoryItemId,
    tracked: true,
  });

  try {
    await activateInventoryAtLocation({
      inventoryItemId: input.inventoryItemId,
      locationId: input.locationId,
      available: input.quantity,
    });
    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const looksAlreadyActive =
      message.toLowerCase().includes('already') ||
      message.toLowerCase().includes('stocked') ||
      message.toLowerCase().includes('activated');

    if (!looksAlreadyActive) {
      throw error;
    }
  }

  await setInventoryQuantity({
    inventoryItemId: input.inventoryItemId,
    locationId: input.locationId,
    quantity: input.quantity,
  });
}

export async function pushCatalogProductToShopify(slug: string, productOverride?: ManagedCatalogProduct) {
  const blueprint = productOverride ? buildCatalogBlueprintFromProduct(productOverride) : await getCatalogBlueprintBySlug(slug);
  if (!blueprint) {
    throw new Error('Catalog blueprint not found.');
  }

  const existingProducts = await listProducts({
    first: 5,
    query: `handle:${blueprint.handle}`,
  });

  const publications = await listPublications();
  const publicationIds = findRequiredPublicationIds(publications);
  const categoryId = await resolveTaxonomyCategoryId(blueprint.categoryName);
  if (!categoryId) {
    throw new Error(`Unable to resolve Shopify category for "${blueprint.categoryName}".`);
  }
  const locations = await listLocations();
  const primaryLocation = locations[0];
  const imageSource = normalizeProductImageSource(blueprint.imagePath);

  const existingProduct = existingProducts.nodes.find((product) => product.handle === blueprint.handle);
  if (existingProduct) {
    const updatedProduct = await updateProduct({
      id: existingProduct.id,
      title: blueprint.title,
      descriptionHtml: blueprint.descriptionHtml,
      vendor: blueprint.vendor,
      productType: blueprint.productType,
      category: categoryId ?? undefined,
      status: 'ACTIVE',
      tags: blueprint.tags,
    });

    const syncedProduct = await setProductWeightVariants({
      productId: updatedProduct.id,
      variants: blueprint.variantDefinitions.map((variant) => ({
        label: variant.label,
        price: variant.price,
      })),
    });
    await publishProductToChannels(updatedProduct.id, publicationIds);

    if (primaryLocation) {
      for (const variantBlueprint of blueprint.variantDefinitions) {
        const matchingVariant = syncedProduct.variants.nodes.find((variant) =>
          variant.selectedOptions.some(
            (option) => option.name.toLowerCase() === 'weight' && option.value === variantBlueprint.label
          )
        );

        if (matchingVariant?.inventoryItem?.id) {
          await ensureInventoryReady({
            inventoryItemId: matchingVariant.inventoryItem.id,
            locationId: primaryLocation.id,
            quantity: variantBlueprint.quantity,
          });
        }
      }
    }

    if (imageSource && !updatedProduct.featuredImage) {
      await addProductImage(updatedProduct.id, {
        originalSource: imageSource,
        alt: blueprint.imageAlt ?? blueprint.title,
      });
    }

    return {
      created: false,
      productId: updatedProduct.id,
      handle: updatedProduct.handle,
      title: updatedProduct.title,
    };
  }

  const product = await createProduct({
    title: blueprint.title,
    handle: blueprint.handle,
    descriptionHtml: blueprint.descriptionHtml,
    vendor: blueprint.vendor,
    productType: blueprint.productType,
    category: categoryId ?? undefined,
    status: blueprint.status,
    tags: blueprint.tags,
  });

  const syncedProduct = await setProductWeightVariants({
    productId: product.id,
    variants: blueprint.variantDefinitions.map((variant) => ({
      label: variant.label,
      price: variant.price,
    })),
  });
  await publishProductToChannels(product.id, publicationIds);

  if (primaryLocation) {
    for (const variantBlueprint of blueprint.variantDefinitions) {
      const matchingVariant = syncedProduct.variants.nodes.find((variant) =>
        variant.selectedOptions.some(
          (option) => option.name.toLowerCase() === 'weight' && option.value === variantBlueprint.label
        )
      );

      if (matchingVariant?.inventoryItem?.id) {
        await ensureInventoryReady({
          inventoryItemId: matchingVariant.inventoryItem.id,
          locationId: primaryLocation.id,
          quantity: variantBlueprint.quantity,
        });
      }
    }
  }

  if (imageSource) {
    await addProductImage(product.id, {
      originalSource: imageSource,
      alt: blueprint.imageAlt ?? blueprint.title,
    });
  }

  return {
    created: true,
    productId: product.id,
    handle: product.handle,
    title: product.title,
  };
}
