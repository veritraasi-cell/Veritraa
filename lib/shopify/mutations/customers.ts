import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

export async function updateCustomer(input: {
  customerId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
}) {
  const mutation = `
    mutation UpdateCustomer($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          displayName
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    customerUpdate: {
      customer: { id: string; displayName: string | null } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      id: input.customerId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      tags: input.tags,
    },
  });

  const errorMessage = formatUserErrors(data.customerUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.customerUpdate.customer;
}
