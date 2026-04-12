import { NextResponse } from 'next/server';
import {
  addProductImage,
  bulkUpdateProductVariants,
  createShopifyProduct,
  deleteShopifyProduct,
  getShopifyCustomerDetail,
  getShopifyLocations,
  getShopifyOrderDetail,
  getShopifyProductDetail,
  setInventoryQuantity,
  updateShopifyCustomer,
  updateShopifyOrder,
} from '@/src/lib/shopifyAdmin';

function ok<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function parseTags(value: unknown): string[] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const tags = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return tags.length ? tags : undefined;
}

function parsePriceRows(value: unknown): Array<{ id: string; price?: string; compareAtPrice?: string | null }> {
  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, price, compareAtPrice] = line.split(',').map((part) => part.trim());
      if (!id) {
        throw new Error('Each price row must include a variant ID.');
      }

      return {
        id,
        price: price || undefined,
        compareAtPrice: compareAtPrice || undefined,
      };
    });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const id = url.searchParams.get('id');

  try {
    if (action === 'product') {
      if (!id) {
        return fail('Missing product id.');
      }

      const [product, locations] = await Promise.all([
        getShopifyProductDetail(id),
        getShopifyLocations(),
      ]);

      return ok({ product, locations });
    }

    if (action === 'order') {
      if (!id) {
        return fail('Missing order id.');
      }

      const order = await getShopifyOrderDetail(id);
      return ok({ order });
    }

    if (action === 'customer') {
      if (!id) {
        return fail('Missing customer id.');
      }

      const customer = await getShopifyCustomerDetail(id);
      return ok({ customer });
    }

    if (action === 'locations') {
      const locations = await getShopifyLocations();
      return ok({ locations });
    }

    return fail('Unsupported lookup action.', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Shopify error';
    return fail(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action;

    if (action === 'bulk-price-update') {
      const productId = String(body.productId ?? '').trim();
      const variants = parsePriceRows(body.variantRows);

      if (!productId) {
        return fail('Missing productId.');
      }

      if (!variants.length) {
        return fail('Please add at least one variant row.');
      }

      const result = await bulkUpdateProductVariants(productId, variants);
      return ok({ result });
    }

    if (action === 'create-product') {
      const title = String(body.title ?? '').trim();
      if (!title) {
        return fail('Product title is required.');
      }

      const mediaUrl = String(body.mediaUrl ?? '').trim();
      const mediaAlt = String(body.mediaAlt ?? '').trim();
      const product = await createShopifyProduct({
        title,
        descriptionHtml: String(body.descriptionHtml ?? '').trim() || undefined,
        vendor: String(body.vendor ?? '').trim() || undefined,
        productType: String(body.productType ?? '').trim() || undefined,
        status: (String(body.status ?? 'DRAFT').toUpperCase() as 'ACTIVE' | 'ARCHIVED' | 'DRAFT'),
        tags: parseTags(body.tags),
        price: String(body.price ?? '').trim() || undefined,
        media: mediaUrl
          ? [
              {
                originalSource: mediaUrl,
                alt: mediaAlt || undefined,
              },
            ]
          : undefined,
      });

      return ok({ product });
    }

    if (action === 'add-product-image') {
      const productId = String(body.productId ?? '').trim();
      const imageUrl = String(body.imageUrl ?? '').trim();
      if (!productId || !imageUrl) {
        return fail('Product id and image URL are required.');
      }

      const result = await addProductImage(productId, {
        originalSource: imageUrl,
        alt: String(body.altText ?? '').trim() || undefined,
      });

      return ok({ result });
    }

    if (action === 'delete-product') {
      const productId = String(body.productId ?? '').trim();
      if (!productId) {
        return fail('Product id is required.');
      }

      const deletedProductId = await deleteShopifyProduct(productId);
      return ok({ deletedProductId });
    }

    if (action === 'set-stock') {
      const inventoryItemId = String(body.inventoryItemId ?? '').trim();
      const locationId = String(body.locationId ?? '').trim();
      const quantity = Number(body.quantity);

      if (!inventoryItemId || !locationId || Number.isNaN(quantity)) {
        return fail('Inventory item id, location id, and quantity are required.');
      }

      const result = await setInventoryQuantity({
        inventoryItemId,
        locationId,
        quantity,
      });

      return ok({ result });
    }

    if (action === 'update-order') {
      const orderId = String(body.orderId ?? '').trim();
      if (!orderId) {
        return fail('Order id is required.');
      }

      const result = await updateShopifyOrder({
        orderId,
        email: String(body.email ?? '').trim() || undefined,
        tags: parseTags(body.tags),
      });

      return ok({ result });
    }

    if (action === 'update-customer') {
      const customerId = String(body.customerId ?? '').trim();
      if (!customerId) {
        return fail('Customer id is required.');
      }

      const result = await updateShopifyCustomer({
        customerId,
        firstName: String(body.firstName ?? '').trim() || undefined,
        lastName: String(body.lastName ?? '').trim() || undefined,
        email: String(body.email ?? '').trim() || undefined,
        phone: String(body.phone ?? '').trim() || undefined,
        tags: parseTags(body.tags),
      });

      return ok({ result });
    }

    return fail('Unsupported admin action.', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Shopify error';
    return fail(message, 500);
  }
}
