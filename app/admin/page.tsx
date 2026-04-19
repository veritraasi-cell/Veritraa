import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminDashboardMetrics } from '@/lib/shopify/queries/dashboard';

function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
  }).format(amount);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function AdminPage() {
  try {
    const dashboard = await getAdminDashboardMetrics();

    const kpis = [
      {
        label: "Today's Revenue",
        value: formatCurrency(dashboard.todayRevenue, dashboard.shop.currencyCode),
        note: `${dashboard.shop.myshopifyDomain} live orders`,
      },
      {
        label: "Today's Orders",
        value: String(dashboard.todayOrdersCount),
        note: 'Orders created today',
      },
      {
        label: 'Total Customers',
        value: dashboard.totalCustomers.toLocaleString('en-IN'),
        note: 'Shopify customer count',
      },
      {
        label: 'Total Products',
        value: dashboard.totalProducts.toLocaleString('en-IN'),
        note: 'Products in the catalog',
      },
    ];

    return (
      <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-[#4f2d21]/14 bg-[linear-gradient(135deg,#fff7ec,#f7e0c4)] p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.7)] sm:p-8">
            <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
              Shopify Dashboard
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <h1 className="font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">{dashboard.shop.name}</h1>
                <p className="text-sm leading-7 text-[#734f42] sm:text-base">{dashboard.shop.myshopifyDomain}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href="/admin/products" className="rounded-2xl bg-[#8a3a17] px-4 py-3 font-semibold text-white transition hover:bg-[#6e2e11]">
                  Manage products
                </Link>
                <Link href="/admin/shipping" className="rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]">
                  Open shipping
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((card) => (
              <Card key={card.label}>
                <CardHeader>
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="text-3xl">{card.value}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm text-[#7f5a4a]">{card.note}</CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Last 10 Shopify orders pulled live from the store.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-[1.35rem] border border-[#ead7c4]">
                  <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
                    <thead className="bg-[#fff8ef] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
                      <tr>
                        <th className="px-4 py-3">Order</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0dfd0] bg-white">
                      {dashboard.recentOrders.map((order) => (
                        <tr key={order.id} className="transition hover:bg-[#fffaf4]">
                          <td className="px-4 py-4 font-semibold text-[#4b1f0f]">{order.name}</td>
                          <td className="px-4 py-4 text-[#6f4b3f]">{order.customer?.displayName ?? order.customer?.email ?? 'Customer not available'}</td>
                          <td className="px-4 py-4 text-[#6f4b3f]">
                            {order.displayFinancialStatus} / {order.displayFulfillmentStatus ?? 'UNFULFILLED'}
                          </td>
                          <td className="px-4 py-4 font-semibold text-[#6b2b12]">
                            {formatCurrency(Number(order.totalPriceSet.shopMoney.amount), order.totalPriceSet.shopMoney.currencyCode)}
                          </td>
                          <td className="px-4 py-4 text-[#6f4b3f]">{formatDateTime(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick actions</CardTitle>
                  <CardDescription>Frequently used admin paths.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {[
                    { href: '/admin', label: 'Dashboard overview' },
                    { href: '/admin/products', label: 'Product catalog' },
                    { href: '/admin/customers', label: 'Customer records' },
                    { href: '/admin/shipping', label: 'Shipping settings' },
                  ].map((item) => (
                    <Link key={item.href} href={item.href} className="rounded-2xl border border-[#e6cdb3] bg-[#fffaf4] px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]">
                      {item.label}
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin status</CardTitle>
                  <CardDescription>Foundation layer connected to Shopify.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[#6f4b3f]">
                  <p>Live Shopify data is flowing through the new modular client.</p>
                  <p>Phase 1 auth uses a protected admin shell and session cookie flow.</p>
                  <p>Prisma schema, seed script, and API foundations are ready for the real database connection.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load Shopify dashboard data.';

    return (
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard unavailable</CardTitle>
            <CardDescription>Shopify data could not be loaded for the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{message}</div>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/login" className="rounded-2xl bg-[#8a3a17] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]">
                Return to login
              </Link>
              <Link href="/admin/products" className="rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]">
                Open products
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }
}
