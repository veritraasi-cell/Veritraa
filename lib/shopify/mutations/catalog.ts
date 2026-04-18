import 'server-only';

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { shopifyGraphQL } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

function getMimeTypeForFile(filename: string) {
  const extension = path.extname(filename).toLowerCase();

  if (extension === '.png') {
    return 'image/png';
  }

  if (extension === '.webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

async function createStagedImageSource(localPublicPath: string) {
  const absolutePath = path.join(process.cwd(), 'public', localPublicPath.replace(/^\/+/, ''));
  const fileBuffer = await readFile(absolutePath);
  const filename = path.basename(absolutePath);
  const mimeType = getMimeTypeForFile(filename);

  const stagedUploadMutation = `
    mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const stagedUploadData = await shopifyGraphQL<{
    stagedUploadsCreate: {
      stagedTargets: Array<{
        url: string;
        resourceUrl: string;
        parameters: Array<{ name: string; value: string }>;
      }>;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(stagedUploadMutation, {
    input: [
      {
        filename,
        mimeType,
        httpMethod: 'POST',
        resource: 'IMAGE',
      },
    ],
  });

  const stagedUploadError = formatUserErrors(stagedUploadData.stagedUploadsCreate.userErrors);
  if (stagedUploadError) {
    throw new Error(stagedUploadError);
  }

  const stagedTarget = stagedUploadData.stagedUploadsCreate.stagedTargets[0];
  if (!stagedTarget) {
    throw new Error('Shopify did not return a staged upload target for the image.');
  }

  const formData = new FormData();
  for (const parameter of stagedTarget.parameters) {
    formData.append(parameter.name, parameter.value);
  }

  formData.append('file', new Blob([fileBuffer], { type: mimeType }), filename);

  const uploadResponse = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Image upload to Shopify staging failed (${uploadResponse.status} ${uploadResponse.statusText}).`);
  }

  return stagedTarget.resourceUrl;
}

export async function bulkUpdateProductVariants(
  productId: string,
  variants: Array<{
    id: string;
    price?: string;
    compareAtPrice?: string | null;
  }>
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

  const data = await shopifyGraphQL<{
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

export async function addProductImage(
  productId: string,
  image: { originalSource: string; alt?: string }
) {
  const originalSource = image.originalSource.startsWith('/')
    ? await createStagedImageSource(image.originalSource)
    : image.originalSource;

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

  const data = await shopifyGraphQL<{
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
        originalSource,
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
