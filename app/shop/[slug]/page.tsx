import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import CustomerAccessGate from '@/components/site/CustomerAccessGate';
import ProductDetailTemplate from '@/components/site/ProductDetailTemplate';
import ProductReviewsPanel from '@/components/site/ProductReviewsPanel';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { listProductReviews } from '@/lib/customer-store';
import { brochureDownloadHref } from '@/src/data/mockData';
import { getCatalogProductBySlug } from '@/src/lib/catalog';
import { isShopProductLive } from '@/src/lib/liveCatalog';
import { getStorefrontProductByHandle } from '@/src/lib/shopifyStorefront';

interface ProductPageProps {
  readonly params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product not found | Veritraa',
    };
  }

  return {
    title: `${product.name} | Veritraa`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const authenticatedCustomerSession = await getCurrentCustomerSession(cookieStore);

  if (!authenticatedCustomerSession) {
    return (
      <CustomerAccessGate
        description="This product page stays locked until you sign in with Google. That keeps the shop, cart, comments, likes, and order history attached to authenticated Firebase users only."
        title="Login to view this product"
      />
    );
  }

  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isLive = await isShopProductLive(slug);
  if (!isLive) {
    notFound();
  }

  const storefrontLookup = await getStorefrontProductByHandle(product.shopifyHandle ?? product.slug)
    .then((value) => ({ storefrontProduct: value, storefrontError: null as string | null }))
    .catch((error) => ({
      storefrontProduct: null,
      storefrontError: error instanceof Error ? error.message : 'Unknown Shopify Storefront error.',
    }));

  const { storefrontProduct, storefrontError } = storefrontLookup;
  const reviews = await listProductReviews(slug);

  return (
    <>
      <ProductDetailTemplate
        product={product}
        variants={
          storefrontProduct?.variants
            .filter((variant) => variant.availableForSale)
            .map((variant) => ({
              id: variant.id,
              title:
                variant.selectedOptions.find((option) => option.name.toLowerCase() === 'weight')?.value ?? variant.title,
              price: variant.price,
            })) ?? []
        }
        storefrontError={storefrontError}
        brochureDownloadHref={brochureDownloadHref}
      />
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <ProductReviewsPanel
          productSlug={slug}
          initialReviews={reviews}
          initialSession={authenticatedCustomerSession.customer ?? null}
        />
      </div>
    </>
  );
}
