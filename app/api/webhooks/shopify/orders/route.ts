import { createHmac, randomUUID, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { findCustomerByEmail, storeCustomerOrderSnapshot } from '@/lib/customer-store';

function getWebhookSecret() {
  return process.env.SHOPIFY_WEBHOOK_SECRET?.trim();
}

function verifyWebhook(rawBody: string, signatureHeader: string | null) {
  const secret = getWebhookSecret();

  if (!secret) {
    throw new Error('Missing SHOPIFY_WEBHOOK_SECRET in .env.local.');
  }

  if (!signatureHeader) {
    return false;
  }

  const digest = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  const expected = Buffer.from(digest, 'base64');
  const provided = Buffer.from(signatureHeader, 'base64');

  if (expected.length !== provided.length) {
    return false;
  }

  return timingSafeEqual(expected, provided);
}

type ShopifyOrderWebhookPayload = {
  id?: string | number;
  name?: string;
  email?: string | null;
  customer?: {
    id?: string | number;
    email?: string | null;
    phone?: string | null;
  } | null;
  total_price?: string;
  currency?: string;
  financial_status?: string;
  fulfillment_status?: string | null;
  line_items?: Array<{
    title?: string;
    quantity?: number;
    price?: string;
    currency?: string;
    price_set?: {
      shop_money?: {
        amount?: string;
        currency_code?: string;
      };
    };
  }>;
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get('x-shopify-hmac-sha256');

    if (!verifyWebhook(rawBody, signatureHeader)) {
      return NextResponse.json({ ok: false, error: 'Invalid Shopify webhook signature.' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as ShopifyOrderWebhookPayload;
    const customerEmail = (payload.customer?.email ?? payload.email ?? '').trim().toLowerCase();
    const customer = customerEmail ? await findCustomerByEmail(customerEmail) : null;

    await storeCustomerOrderSnapshot({
      shopifyOrderId: String(payload.id ?? payload.name ?? randomUUID()),
      orderName: String(payload.name ?? payload.id ?? 'Shopify order'),
      customerId: customer?.id ?? null,
      customerEmail,
      customerPhone: payload.customer?.phone?.trim() ?? null,
      displayFinancialStatus: String(payload.financial_status ?? 'unknown'),
      displayFulfillmentStatus: payload.fulfillment_status ?? null,
      totalAmount: {
        amount: String(payload.total_price ?? '0'),
        currencyCode: String(payload.currency ?? 'INR'),
      },
      lineItems: (payload.line_items ?? []).map((item) => ({
        title: String(item.title ?? '').trim(),
        quantity: Number(item.quantity ?? 0),
        amount: String(item.price_set?.shop_money?.amount ?? item.price ?? '0'),
        currencyCode: String(item.price_set?.shop_money?.currency_code ?? item.currency ?? payload.currency ?? 'INR'),
      })),
      rawOrder: JSON.parse(rawBody) as Record<string, unknown>,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unable to process Shopify order webhook.',
      },
      { status: 500 }
    );
  }
}