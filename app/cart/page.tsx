import { cookies } from 'next/headers';
import CustomerAccessGate from '@/components/site/CustomerAccessGate';
import CartPageClient from '@/components/site/CartPageClient';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';

export default async function CartPage() {
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSession(cookieStore);

  if (!session) {
    return (
      <CustomerAccessGate
        description="The cart is protected by Google login. Sign in first, then you can add products, update quantities, and proceed to Shopify checkout."
        title="Login to open your cart"
      />
    );
  }

  return <CartPageClient />;
}
