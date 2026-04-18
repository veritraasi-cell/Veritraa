import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

export async function setProductWeightVariants(input: {
  productId: string;
  variants: Array<{
    label: string;
    price: string;
  }>;
}) {
  const mutation = `
    mutation SetProductWeightVariants($identifier: ProductSetIdentifiers, $input: ProductSetInput!, $synchronous: Boolean!) {
      productSet(identifier: $identifier, input: $input, synchronous: $synchronous) {
        product {
          id
          variants(first: 25) {
            nodes {
              id
              title
              price
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

  const data = await shopifyGraphQL<{
    productSet: {
      product: {
        id: string;
        variants: {
          nodes: Array<{
            id: string;
            title: string;
            price: string;
            inventoryItem: { id: string } | null;
            selectedOptions: Array<{ name: string; value: string }>;
          }>;
        };
      } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    identifier: {
      id: input.productId,
    },
    synchronous: true,
    input: {
      productOptions: [
        {
          name: 'Weight',
          position: 1,
          values: input.variants.map((variant) => ({
            name: variant.label,
          })),
        },
      ],
      variants: input.variants.map((variant) => ({
        optionValues: [
          {
            optionName: 'Weight',
            name: variant.label,
          },
        ],
        price: Number(variant.price),
      })),
    },
  });

  const errorMessage = formatUserErrors(data.productSet.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!data.productSet.product) {
    throw new Error('Unable to sync Shopify weight variants.');
  }

  return data.productSet.product;
}
