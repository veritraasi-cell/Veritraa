import Link from 'next/link';
import { listUnpushedCatalogProducts } from '@/src/lib/catalog';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function QueuePage() {
  const unpushedProducts = await listUnpushedCatalogProducts();

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/90 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <div className="space-y-3">
          <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
            Queue
          </p>
          <h1 className="font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">
            Unpushed Items
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">
            These items are in the queue and hidden from the storefront. Click the "Bulk Push" button on the Products
            page to make them live on both your website and Shopify.
          </p>
        </div>

        {unpushedProducts.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-green-200 bg-green-50 p-6 text-center">
            <p className="font-semibold text-green-900">✅ All items have been pushed!</p>
            <p className="mt-2 text-sm text-green-800">Your queue is empty. All products are live on the website and Shopify.</p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[#ead7c4] bg-[#fffaf4]">
            <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
              <thead className="bg-[#fff1e1] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0dfd0] bg-white">
                {unpushedProducts.map((product) => (
                  <tr key={product.slug} className="transition hover:bg-[#fffaf4]">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-[#4b1f0f]">{product.name}</p>
                        <p className="text-xs text-[#7f5a4a]">{product.slug}</p>
                        <p className="mt-1 text-xs text-[#a07a62]">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#6b2b12]">
                      {product.price ? `₹${product.price}` : 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-[#6f4b3f]">{product.quantity}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-900">
                        ⏳ In Queue
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
          >
            Back to Products
          </Link>
          {unpushedProducts.length > 0 && (
            <a
              href="/admin/products#bulk-push"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              🚀 Bulk Push All
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
