import { cookies } from 'next/headers';
import CustomerAccessGate from '@/components/site/CustomerAccessGate';
import CartPageClient from '@/components/site/CartPageClient';
import { getCurrentCustomerSessionLite } from '@/lib/auth/customer-auth';

export default async function CartPage() {
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSessionLite(cookieStore);

  if (!session) {
    return (
      <CustomerAccessGate
        description="Sign in to access your saved cart, update quantities, and continue to checkout."
        title="Sign in to open your cart"
      />
    );
  }

  return <CartPageClient />;
}
