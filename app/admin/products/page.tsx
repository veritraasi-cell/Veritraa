import Link from 'next/link';
import AdminProductRowActions from '@/components/admin/AdminProductRowActions';
import BulkProductActions from '@/components/admin/BulkProductActions';
import CatalogDraftPublisher from '@/components/admin/CatalogDraftPublisher';
import ProductCreator from '@/components/admin/ProductCreator';
import { listProducts } from '@/lib/shopify/queries/products';
import { listCatalogBlueprints } from '@/src/lib/catalogBlueprint';
import { listCatalogProducts } from '@/src/lib/catalog';
import { getLiveShopProducts } from '@/src/lib/liveCatalog';
import { getShopifyAdminDashboardData } from '@/src/lib/shopifyAdmin';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function ProductsAdminPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const params = (await searchParams) ?? {};
  const editSlug = typeof params.edit === 'string' ? params.edit : undefined;

  const [dashboard, products, catalogProducts] = await Promise.all([
    getShopifyAdminDashboardData(),
    listProducts({ first: 50 }),
    listCatalogProducts(),
  ]);

  const editProduct = editSlug ? catalogProducts.find((product) => product.slug === editSlug) ?? null : null;

  const [liveProducts, localDrafts] = await Promise.all([
    getLiveShopProducts(catalogProducts),
    listCatalogBlueprints(catalogProducts),
  ]);

  const unpushedProducts = catalogProducts.filter((product) => !product.isPushed);
  const liveStorefrontHandles = new Set(liveProducts.map((product) => product.shopifyHandle ?? product.slug));
  const filteredDrafts = localDrafts.filter((draft) => !liveStorefrontHandles.has(draft.handle));
  const editableSlugByHandle = new Map(
    catalogProducts.map((product) => [product.shopifyHandle ?? product.slug, product.slug] as const)
  );
  const catalogSlugByHandle = new Map(
    catalogProducts.map((product) => [product.shopifyHandle ?? product.slug, product.slug] as const)
  );

  return (
    <div className="space-y-6">
      <BulkProductActions unpushedCount={unpushedProducts.length} />

      <section className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/90 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
              Live Catalog
            </p>
            <h1 className="font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">Products synced with Shopify</h1>
            <p className="max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">
              Only products that are already live on Shopify should appear on the storefront. Any remaining local items stay
              hidden until you push them from this admin panel.
            </p>
          </div>
          <Link
            href={`https://${dashboard.myshopifyDomain}/admin/products`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
          >
            Open Shopify admin
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#ead7c4] bg-[#fffaf4]">
          <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
            <thead className="bg-[#fff1e1] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Inventory</th>
                <th className="px-4 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0dfd0] bg-white">
              {products.nodes.map((product) => {
                const catalogSlug = catalogSlugByHandle.get(product.handle);
                const editableSlug = editableSlugByHandle.get(product.handle);

                return (
                <tr key={product.id} className="transition hover:bg-[#fffaf4]">
                  <td className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                    <p className="font-semibold text-[#4b1f0f]">{product.title}</p>
                    <p className="text-xs text-[#7f5a4a]">{product.handle}</p>
                        {catalogSlug && !editableSlug ? (
                          <p className="mt-1 text-[11px] text-[#a07a62]">Template-backed product</p>
                        ) : null}
                      </div>
                      <AdminProductRowActions productId={product.id} editableSlug={editableSlug ?? null} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[#6f4b3f]">{product.status}</td>
                  <td className="px-4 py-4 font-semibold text-[#6b2b12]">{product.totalInventory}</td>
                  <td className="px-4 py-4 text-[#6f4b3f]">{formatDateTime(product.updatedAt)}</td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </section>

      <ProductCreator initialProduct={editProduct} />

      <CatalogDraftPublisher
        drafts={filteredDrafts.map((draft) => ({
          slug: draft.slug,
          handle: draft.handle,
          title: draft.title,
          price: draft.price,
          quantity: draft.quantity,
          productType: draft.productType,
          tags: draft.tags,
        }))}
      />
    </div>
  );
}
