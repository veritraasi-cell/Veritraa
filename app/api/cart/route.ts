import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomerSessionLite } from '@/lib/auth/customer-auth';
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from '@/src/lib/shopifyStorefront';

function ok<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  const session = await getCurrentCustomerSessionLite(request.cookies);

  if (!session) {
    return fail('Please log in before accessing the cart.', 401);
  }

  const url = new URL(request.url);
  const cartId = url.searchParams.get('cartId')?.trim();

  if (!cartId) {
    return ok({ cart: null });
  }

  try {
    const cart = await getCart(cartId);
    return ok({ cart });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load cart.';
    return fail(message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentCustomerSessionLite(request.cookies);

    if (!session) {
      return fail('Please log in before shopping.', 401);
    }

    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action ?? '').trim();

    if (action === 'add') {
      const cartId = String(body.cartId ?? '').trim();
      const merchandiseId = String(body.merchandiseId ?? '').trim();
      const quantity = Number(body.quantity ?? 1);

      if (!merchandiseId || Number.isNaN(quantity) || quantity < 1) {
        return fail('Valid merchandiseId and quantity are required.');
      }

      const cart = cartId
        ? await addCartLines(cartId, [{ merchandiseId, quantity }])
        : await createCart([{ merchandiseId, quantity }]);

      return ok({ cart });
    }

    if (action === 'update-line') {
      const cartId = String(body.cartId ?? '').trim();
      const lineId = String(body.lineId ?? '').trim();
      const quantity = Number(body.quantity);

      if (!cartId || !lineId || Number.isNaN(quantity) || quantity < 1) {
        return fail('Valid cartId, lineId, and quantity are required.');
      }

      const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
      return ok({ cart });
    }

    if (action === 'remove-line') {
      const cartId = String(body.cartId ?? '').trim();
      const lineId = String(body.lineId ?? '').trim();

      if (!cartId || !lineId) {
        return fail('cartId and lineId are required.');
      }

      const cart = await removeCartLines(cartId, [lineId]);
      return ok({ cart });
    }

    return fail('Unsupported cart action.', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update cart.';
    return fail(message, 500);
  }
}
