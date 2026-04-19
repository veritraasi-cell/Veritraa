import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type { ShopifyProductDetail, ShopifyProductVariant } from '@/lib/shopify/types';
import { bulkUpdateProductVariants } from '@/lib/shopify/mutations/catalog';

interface ProductMutationResponse {
  productCreate?: {
    product: (Omit<ShopifyProductDetail, 'media' | 'variants'> & {
      media: { nodes: ShopifyProductDetail['media'] };
      variants: { nodes: ShopifyProductVariant[] };
    }) | null;
    userErrors: Array<{ field?: string[] | null; message: string }>;
  };
  productUpdate?: {
    product: (Omit<ShopifyProductDetail, 'media' | 'variants'> & {
      media: { nodes: ShopifyProductDetail['media'] };
      variants: { nodes: ShopifyProductVariant[] };
    }) | null;
    userErrors: Array<{ field?: string[] | null; message: string }>;
  };
  productDelete?: {
    deletedProductId: string | null;
    userErrors: Array<{ field?: string[] | null; message: string }>;
  };
}

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

export async function createProduct(input: {
  title: string;
  handle?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  category?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  tags?: string[];
  price?: string;
  media?: Array<{
    alt?: string;
    originalSource: string;
  }>;
}) {
  const mutation = `
    mutation CreateProduct($product: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $product, media: $media) {
        product {
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
          variants(first: 1) {
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<ProductMutationResponse>(mutation, {
    product: {
      title: input.title,
      handle: input.handle,
      descriptionHtml: input.descriptionHtml,
      vendor: input.vendor,
      productType: input.productType,
      category: input.category,
      status: input.status ?? 'DRAFT',
      tags: input.tags,
    },
    media: input.media?.map((entry) => ({
      alt: entry.alt,
      originalSource: entry.originalSource,
      mediaContentType: 'IMAGE',
    })),
  });

  const errorMessage = formatUserErrors(data.productCreate?.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const product = data.productCreate?.product;
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

  return {
    ...product,
    media: product.media.nodes,
    variants: product.variants.nodes,
  } satisfies ShopifyProductDetail;
}

export async function updateProduct(input: {
  id: string;
  title?: string;
  descriptionHtml?: string;
  vendor?: string;
  productType?: string;
  category?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  tags?: string[];
}) {
  const mutation = `
    mutation UpdateProduct($product: ProductUpdateInput!) {
      productUpdate(product: $product) {
        product {
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
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<ProductMutationResponse>(mutation, {
    product: {
      id: input.id,
      title: input.title,
      descriptionHtml: input.descriptionHtml,
      vendor: input.vendor,
      productType: input.productType,
      category: input.category,
      status: input.status,
      tags: input.tags,
    },
  });

  const errorMessage = formatUserErrors(data.productUpdate?.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  const product = data.productUpdate?.product;
  if (!product) {
    throw new Error('Product update failed.');
  }

  return {
    ...product,
    media: product.media.nodes,
    variants: product.variants.nodes,
  } satisfies ShopifyProductDetail;
}

export async function deleteProduct(productId: string) {
  const mutation = `
    mutation DeleteProduct($input: ProductDeleteInput!, $synchronous: Boolean) {
      productDelete(input: $input, synchronous: $synchronous) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<ProductMutationResponse>(mutation, {
    input: {
      id: productId,
    },
    synchronous: true,
  });

  const errorMessage = formatUserErrors(data.productDelete?.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.productDelete?.deletedProductId ?? null;
}
