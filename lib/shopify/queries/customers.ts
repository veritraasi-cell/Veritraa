import 'server-only';

import { shopifyGraphQL } from '@/lib/shopify/client';
import type { ShopifyCustomerDetail, ShopifyCustomerSummary, ShopifyPageInfo } from '@/lib/shopify/types';

interface CustomerListQueryResponse {
  customers: {
    nodes: ShopifyCustomerSummary[];
    pageInfo: ShopifyPageInfo;
  };
}

interface CustomerDetailQueryResponse {
  customer: ShopifyCustomerDetail | null;
}

export async function listCustomers(options: { first?: number; after?: string | null; query?: string | null } = {}) {
  const query = `
    query CustomerList($first: Int!, $after: String, $query: String) {
      customers(first: $first, after: $after, query: $query, reverse: true, sortKey: UPDATED_AT) {
        nodes {
          id
          displayName
          email
          phone
          state
          numberOfOrders
          amountSpent {
            amount
            currencyCode
          }
          createdAt
          updatedAt
          tags
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyGraphQL<CustomerListQueryResponse>(query, {
    first: options.first ?? 25,
    after: options.after ?? null,
    query: options.query ?? null,
  });

  return data.customers;
}

export async function getCustomer(customerId: string) {
  const query = `
    query CustomerDetail($id: ID!) {
      customer(id: $id) {
        id
        displayName
        firstName
        lastName
        email
        phone
        state
        tags
        note
        createdAt
        updatedAt
        amountSpent {
          amount
          currencyCode
        }
        numberOfOrders
      }
    }
  `;

  const data = await shopifyGraphQL<CustomerDetailQueryResponse>(query, {
    id: customerId,
  });

  if (!data.customer) {
    throw new Error('Customer not found.');
  }

  return data.customer;
}
