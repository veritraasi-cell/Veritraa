import ShopCatalogClient from '@/components/site/ShopCatalogClient';
import CustomerAccessGate from '@/components/site/CustomerAccessGate';
import { getCurrentCustomerSessionLite } from '@/lib/auth/customer-auth';
import { listCatalogCategories, listLiveCatalogProducts } from '@/src/lib/catalog';
import { cookies } from 'next/headers';

export default async function ShopPage() {
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSessionLite(cookieStore);

  if (!session) {
    return (
      <CustomerAccessGate
        description="The product catalog is locked until you sign in with Google. Once logged in, your cart, comments, likes, and order history are tied to your Firebase customer profile."
        title="Login to browse the shop"
      />
    );
  }

  const catalogProducts = await listLiveCatalogProducts();
  const categories = await listCatalogCategories(catalogProducts);
  return <ShopCatalogClient products={catalogProducts} categories={categories} />;
}
