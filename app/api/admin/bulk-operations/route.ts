import { NextResponse } from 'next/server';
import { listProducts } from '@/lib/shopify/queries/products';
import { deleteProduct } from '@/lib/shopify/mutations/products';
import { listCatalogProducts, listUnpushedCatalogProducts } from '@/src/lib/catalog';
import { pushCatalogProductToShopify } from '@/lib/shopify/catalog-sync';

function ok<T>(data: T) {
  return NextResponse.json({ ok: true, data });
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action;

    if (action === 'empty-store') {
      // Delete all products from Shopify
      const { nodes: products } = await listProducts({ first: 250 });
      const deletedCount = { shopify: 0 };

      // Delete from Shopify
      for (const product of products) {
        try {
          await deleteProduct(product.id);
          deletedCount.shopify++;
        } catch (error) {
          console.error(`Failed to delete Shopify product ${product.id}:`, error);
        }
      }

      return ok({
        message: 'Store emptied successfully',
        deleted: deletedCount,
      });
    }

    if (action === 'bulk-push') {
      const catalogProducts = await listCatalogProducts();
      const draftProducts = await listUnpushedCatalogProducts(catalogProducts);

      for (const product of draftProducts) {
        await pushCatalogProductToShopify(product.slug, product);
      }

      return ok({
        message: 'All items pushed successfully',
        pushed: draftProducts.length,
      });
    }

    return fail('Unsupported bulk action.', 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return fail(message, 500);
  }
}
