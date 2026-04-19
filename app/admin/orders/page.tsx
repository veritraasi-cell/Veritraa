import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrder, listOrders } from '@/lib/shopify/queries/orders';

function formatCurrency(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
  }).format(Number(amount || 0));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function OrdersAdminPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ orderId?: string }>;
}>) {
  const params = (await searchParams) ?? {};
  const selectedOrderId = params.orderId?.trim() || null;

  const [orders, selectedOrder] = await Promise.all([
    listOrders({ first: 15 }),
    selectedOrderId ? getOrder(selectedOrderId) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto max-w-[1600px] space-y-6">
      <div className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/90 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
          Live Orders
        </p>
        <h1 className="mt-4 font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">Orders synced from Shopify</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">
          This page now reads live Shopify orders instead of a placeholder. Pick an order to inspect the current line items,
          payment status, and fulfillment state from the store.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shopify orders</CardTitle>
            <CardDescription>Last 15 orders from the connected store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-[1.35rem] border border-[#ead7c4]">
              <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
                <thead className="bg-[#fff8ef] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0dfd0] bg-white">
                  {orders.nodes.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#fffaf4]">
                      <td className="px-4 py-4 font-semibold text-[#4b1f0f]">
                        <Link href={`/admin/orders?orderId=${encodeURIComponent(order.id)}`} className="hover:text-[#8a3a17]">
                          {order.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-[#6f4b3f]">{order.customer?.displayName ?? order.customer?.email ?? 'Guest'}</td>
                      <td className="px-4 py-4 font-semibold text-[#6b2b12]">
                        {formatCurrency(order.totalPriceSet.shopMoney.amount, order.totalPriceSet.shopMoney.currencyCode)}
                      </td>
                      <td className="px-4 py-4 text-[#6f4b3f]">
                        {order.displayFinancialStatus} / {order.displayFulfillmentStatus ?? 'UNFULFILLED'}
                      </td>
                      <td className="px-4 py-4 text-[#6f4b3f]">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedOrder ? selectedOrder.name : 'Order detail'}</CardTitle>
            <CardDescription>
              {selectedOrder ? 'Live detail from Shopify for the selected order.' : 'Choose an order from the table to inspect it.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#6f4b3f]">
            {selectedOrder ? (
              <>
                <div className="rounded-2xl border border-[#ead7c4] bg-[#fffaf4] p-4">
                  <p className="font-semibold text-[#4b1f0f]">
                    {formatCurrency(
                      selectedOrder.totalPriceSet.shopMoney.amount,
                      selectedOrder.totalPriceSet.shopMoney.currencyCode
                    )}
                  </p>
                  <p className="mt-1">
                    {selectedOrder.displayFinancialStatus} / {selectedOrder.displayFulfillmentStatus ?? 'UNFULFILLED'}
                  </p>
                  <p className="mt-1">{formatDateTime(selectedOrder.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  {selectedOrder.lineItems.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="rounded-2xl border border-[#ead7c4] bg-white p-4">
                      <p className="font-semibold text-[#4b1f0f]">{item.title}</p>
                      <p className="mt-1 text-[#6f4b3f]">
                        {item.quantity} units,{' '}
                        {formatCurrency(
                          item.originalTotalSet.shopMoney.amount,
                          item.originalTotalSet.shopMoney.currencyCode
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d8bea2] bg-[#fffaf4] p-4 text-[#7f5a4a]">
                No order selected yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
