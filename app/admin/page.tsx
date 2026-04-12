import Link from 'next/link';
import {
  getShopifyAdminDashboardData,
  validateShopifyAdminConfig,
} from '@/src/lib/shopifyAdmin';

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

function SetupCard() {
  const config = validateShopifyAdminConfig();

  return (
    <section className="mx-auto mt-6 max-w-5xl rounded-3xl border border-[#7a2f2f]/20 bg-[#fff8ef] p-6 shadow-[0_22px_42px_-32px_rgba(122,47,47,0.55)] sm:p-10">
      <p className="inline-flex items-center rounded-full bg-[#f8e8cf] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3a17]">
        Shopify Setup Required
      </p>
      <h1 className="mt-4 font-headline text-2xl text-[#5c1f10] sm:text-4xl">Admin Panel is Ready to Connect</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f4b3f] sm:text-base">
        Add these values to your local <code className="rounded bg-[#f4e4cf] px-1 py-0.5">.env.local</code> file,
        then restart the dev server.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#dcbfa7] bg-white/80 p-4">
          <p className="font-semibold text-[#5c1f10]">SHOPIFY_STORE_DOMAIN</p>
          <p className="mt-1 text-sm text-[#7f5a4a]">
            {config.hasStoreDomain ? 'Configured' : 'Missing'}
          </p>
        </div>
        <div className="rounded-2xl border border-[#dcbfa7] bg-white/80 p-4">
          <p className="font-semibold text-[#5c1f10]">SHOPIFY_ADMIN_ACCESS_TOKEN</p>
          <p className="mt-1 text-sm text-[#7f5a4a]">
            {config.hasAdminToken ? 'Configured' : 'Missing'}
          </p>
        </div>
      </div>

      <pre className="mt-6 overflow-x-auto rounded-2xl border border-[#ebd1bb] bg-[#fffdf8] p-4 text-xs leading-6 text-[#5f3f33] sm:text-sm">
{`SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxx
SHOPIFY_API_VERSION=${config.apiVersion}`}
      </pre>

      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link
          href="https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/generate-app-access-tokens-admin"
          target="_blank"
          className="rounded-full bg-[#8a3a17] px-5 py-2.5 font-semibold text-white transition hover:bg-[#6e2e11]"
        >
          How to get Admin API token
        </Link>
        <Link
          href="/"
          className="rounded-full border border-[#cfa58d] px-5 py-2.5 font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdd]"
        >
          Back to storefront
        </Link>
      </div>
    </section>
  );
}

export default async function AdminPage() {
  const config = validateShopifyAdminConfig();

  if (!config.hasStoreDomain || !config.hasAdminToken) {
    return <SetupCard />;
  }

  try {
    const data = await getShopifyAdminDashboardData();

    return (
      <section className="mx-auto mt-6 max-w-7xl px-4 pb-12 sm:px-6 md:px-8">
        <div className="rounded-3xl border border-[#4f2d21]/20 bg-[linear-gradient(130deg,#fff6eb,#fbe9d6)] p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.7)] sm:p-8">
          <p className="inline-flex items-center rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
            Shopify Admin Panel
          </p>
          <h1 className="mt-4 font-headline text-2xl text-[#4b1f0f] sm:text-4xl">{data.shopName}</h1>
          <p className="mt-2 text-sm text-[#734f42] sm:text-base">{data.myshopifyDomain}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e4c6a9] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Products</p>
              <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.productsCount}</p>
            </div>
            <div className="rounded-2xl border border-[#e4c6a9] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Orders</p>
              <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.ordersCount}</p>
            </div>
            <div className="rounded-2xl border border-[#e4c6a9] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c5f4d]">Product Variants</p>
              <p className="mt-2 text-3xl font-bold text-[#5b2410]">{data.productVariantsCount}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-[#4f2d21]/15 bg-white/85 p-5 shadow-[0_18px_40px_-34px_rgba(63,28,16,0.65)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl text-[#4b1f0f]">Recently Updated Products</h2>
            </div>
            <div className="mt-4 space-y-3">
              {data.recentProducts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-[#ecd7c5] bg-[#fffaf4] p-4">
                  <p className="font-semibold text-[#4b1f0f]">{product.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#7f5a4a]">
                    <span className="rounded-full bg-[#f2deca] px-2 py-1 uppercase tracking-[0.08em]">
                      {product.status}
                    </span>
                    <span>{product.totalInventory} in stock</span>
                    <span>Updated {formatDateTime(product.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-[#4f2d21]/15 bg-white/85 p-5 shadow-[0_18px_40px_-34px_rgba(63,28,16,0.65)] sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl text-[#4b1f0f]">Latest Orders</h2>
            </div>
            <div className="mt-4 space-y-3">
              {data.recentOrders.length === 0 ? (
                <p className="rounded-2xl border border-[#ecd7c5] bg-[#fffaf4] p-4 text-sm text-[#7f5a4a]">
                  No orders found yet.
                </p>
              ) : (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-[#ecd7c5] bg-[#fffaf4] p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-[#4b1f0f]">{order.name}</p>
                      <p className="text-sm font-semibold text-[#6b2b12]">
                        {formatMoney(order.totalPriceSet.shopMoney.amount, order.totalPriceSet.shopMoney.currencyCode)}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#7f5a4a]">
                      <span className="rounded-full bg-[#f2deca] px-2 py-1 uppercase tracking-[0.08em]">
                        {order.displayFinancialStatus}
                      </span>
                      <span className="rounded-full bg-[#f8ebdf] px-2 py-1 uppercase tracking-[0.08em]">
                        {order.displayFulfillmentStatus ?? 'UNFULFILLED'}
                      </span>
                      <span>{formatDateTime(order.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-xs text-[#8d6b5f]">
                      {order.customer?.displayName ?? order.customer?.email ?? 'Customer not available'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Shopify API error';

    return (
      <section className="mx-auto mt-6 max-w-5xl rounded-3xl border border-[#7a2f2f]/20 bg-[#fff8ef] p-6 shadow-[0_22px_42px_-32px_rgba(122,47,47,0.55)] sm:p-10">
        <p className="inline-flex items-center rounded-full bg-[#f8e8cf] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3a17]">
          Shopify Connection Error
        </p>
        <h1 className="mt-4 font-headline text-2xl text-[#5c1f10] sm:text-4xl">We could not load admin data</h1>
        <p className="mt-3 text-sm leading-7 text-[#6f4b3f] sm:text-base">
          Please verify your app scopes and token in Shopify Partners dashboard.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-2xl border border-[#ebd1bb] bg-[#fffdf8] p-4 text-xs leading-6 text-[#5f3f33] sm:text-sm">
          {message}
        </pre>
      </section>
    );
  }
}
