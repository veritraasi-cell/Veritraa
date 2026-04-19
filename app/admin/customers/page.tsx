import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCustomer, listCustomers } from '@/lib/shopify/queries/customers';

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

export default async function CustomersAdminPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<{ customerId?: string }>;
}>) {
  const params = (await searchParams) ?? {};
  const selectedCustomerId = params.customerId?.trim() || null;

  const [customers, selectedCustomer] = await Promise.all([
    listCustomers({ first: 15 }),
    selectedCustomerId ? getCustomer(selectedCustomerId) : Promise.resolve(null),
  ]);

  return (
    <section className="mx-auto max-w-[1600px] space-y-6">
      <div className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/90 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
          Live Customers
        </p>
        <h1 className="mt-4 font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">Customers synced from Shopify</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">
          Customer records are now pulled live from Shopify, so the admin team can inspect current contact details, tags, spend,
          and order counts without landing on a placeholder page.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Shopify customers</CardTitle>
            <CardDescription>Last 15 customers from the connected store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-[1.35rem] border border-[#ead7c4]">
              <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
                <thead className="bg-[#fff8ef] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Orders</th>
                    <th className="px-4 py-3">Spent</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0dfd0] bg-white">
                  {customers.nodes.map((customer) => (
                    <tr key={customer.id} className="transition hover:bg-[#fffaf4]">
                      <td className="px-4 py-4 font-semibold text-[#4b1f0f]">
                        <Link
                          href={`/admin/customers?customerId=${encodeURIComponent(customer.id)}`}
                          className="hover:text-[#8a3a17]"
                        >
                          {customer.displayName ?? 'Customer'}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-[#6f4b3f]">{customer.email ?? customer.phone ?? 'No contact info'}</td>
                      <td className="px-4 py-4 font-semibold text-[#6b2b12]">{customer.numberOfOrders}</td>
                      <td className="px-4 py-4 text-[#6f4b3f]">
                        {customer.amountSpent
                          ? formatCurrency(customer.amountSpent.amount, customer.amountSpent.currencyCode)
                          : 'No spend yet'}
                      </td>
                      <td className="px-4 py-4 text-[#6f4b3f]">{formatDateTime(customer.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedCustomer?.displayName ?? 'Customer detail'}</CardTitle>
            <CardDescription>
              {selectedCustomer
                ? 'Live contact and tag data from Shopify for the selected customer.'
                : 'Choose a customer from the table to inspect the profile.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#6f4b3f]">
            {selectedCustomer ? (
              <>
                <div className="rounded-2xl border border-[#ead7c4] bg-[#fffaf4] p-4">
                  <p className="font-semibold text-[#4b1f0f]">{selectedCustomer.email ?? 'No email on file'}</p>
                  <p className="mt-1">{selectedCustomer.phone ?? 'No phone on file'}</p>
                  <p className="mt-1">State: {selectedCustomer.state}</p>
                  <p className="mt-1">Orders: {selectedCustomer.numberOfOrders}</p>
                </div>
                <div className="rounded-2xl border border-[#ead7c4] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c5f4d]">Tags</p>
                  <p className="mt-2 text-[#4b1f0f]">
                    {selectedCustomer.tags.length ? selectedCustomer.tags.join(', ') : 'No tags on this customer yet.'}
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d8bea2] bg-[#fffaf4] p-4 text-[#7f5a4a]">
                No customer selected yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
