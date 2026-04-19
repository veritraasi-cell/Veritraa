import ShopCatalogClient from '@/components/site/ShopCatalogClient';
import { listCatalogCategories, listLiveCatalogProducts } from '@/src/lib/catalog';

export default async function ShopPage() {
  const catalogProducts = await listLiveCatalogProducts();
  const categories = await listCatalogCategories(catalogProducts);
  return <ShopCatalogClient products={catalogProducts} categories={categories} />;
}
