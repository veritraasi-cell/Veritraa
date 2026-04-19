import 'server-only';

import { shopifyGraphQL, shopifyRest } from '@/lib/shopify/client';

function formatUserErrors(userErrors?: Array<{ field?: string[] | null; message: string }>) {
  return userErrors?.map((entry) => entry.message).join('; ') ?? '';
}

function normalizeOrderId(orderId: string) {
  const trimmed = orderId.trim();
  const numericMatch = trimmed.match(/(\d+)$/);

  if (!numericMatch) {
    throw new Error('Enter a valid Shopify order id.');
  }

  return numericMatch[1];
}

export async function fulfillOrder(input: {
  orderId: string;
  trackingNumber?: string;
  trackingCompany?: string;
  notifyCustomer?: boolean;
}) {
  const orderId = normalizeOrderId(input.orderId);

  return shopifyRest<Record<string, unknown>>(`/orders/${orderId}/fulfillments.json`, {
    method: 'POST',
    body: JSON.stringify({
      fulfillment: {
        notify_customer: input.notifyCustomer ?? true,
        tracking_info: input.trackingNumber
          ? {
              number: input.trackingNumber,
              company: input.trackingCompany,
            }
          : undefined,
      },
    }),
  });
}

export async function cancelOrder(input: { orderId: string; reason?: string; notifyCustomer?: boolean }) {
  const orderId = normalizeOrderId(input.orderId);

  return shopifyRest<Record<string, unknown>>(`/orders/${orderId}/cancel.json`, {
    method: 'POST',
    body: JSON.stringify({
      reason: input.reason ?? 'customer',
      notify: input.notifyCustomer ?? true,
    }),
  });
}

export async function refundOrder(input: {
  orderId: string;
  amount?: string;
  currency?: string;
  notifyCustomer?: boolean;
}) {
  const orderId = normalizeOrderId(input.orderId);

  return shopifyRest<Record<string, unknown>>(`/orders/${orderId}/refunds.json`, {
    method: 'POST',
    body: JSON.stringify({
      refund: {
        notify: input.notifyCustomer ?? true,
        shipping: input.amount
          ? {
              amount: input.amount,
              currency: input.currency ?? 'INR',
            }
          : undefined,
      },
    }),
  });
}

export async function updateOrder(input: {
  orderId: string;
  email?: string;
  tags?: string[];
}) {
  const mutation = `
    mutation UpdateOrder($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyGraphQL<{
    orderUpdate: {
      order: { id: string; name: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(mutation, {
    input: {
      id: input.orderId,
      email: input.email,
      tags: input.tags,
    },
  });

  const errorMessage = formatUserErrors(data.orderUpdate.userErrors);
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return data.orderUpdate.order;
}
