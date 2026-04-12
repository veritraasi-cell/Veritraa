import Link from 'next/link';
import ShopifyAdminWorkbench from '@/components/admin/ShopifyAdminWorkbench';
import {
  getShopifyAdminDashboardData,
  validateShopifyAdminConfig,
} from '@/src/lib/shopifyAdmin';

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
          <p className="mt-1 text-sm text-[#7f5a4a]">{config.hasStoreDomain ? 'Configured' : 'Missing'}</p>
        </div>
        <div className="rounded-2xl border border-[#dcbfa7] bg-white/80 p-4">
          <p className="font-semibold text-[#5c1f10]">SHOPIFY_ADMIN_ACCESS_TOKEN</p>
          <p className="mt-1 text-sm text-[#7f5a4a]">{config.hasAdminToken ? 'Configured' : 'Missing'}</p>
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
        <Link href="/" className="rounded-full border border-[#cfa58d] px-5 py-2.5 font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdd]">
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
    return <ShopifyAdminWorkbench initialData={data} />;
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
