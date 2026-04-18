import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

export async function publishProductToChannels(productId: string, publicationIds: string[]) {
  if (!publicationIds.length) {
    return null;
  }

  const mutation = `
    mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          ... on Product {
            id
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
    publishablePublish: {
      publishable: { id: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    id: productId,
    input: publicationIds.map((publicationId) => ({ publicationId })),
  });

  const errorMessage = formatUserErrors(data.publishablePublish.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.publishablePublish.publishable;
}
