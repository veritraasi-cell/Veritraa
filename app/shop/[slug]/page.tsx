import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProductDetailTemplate from '@/components/site/ProductDetailTemplate';
import ProductReviewsPanel from '@/components/site/ProductReviewsPanel';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { listProductReviews } from '@/lib/customer-store';
import { brochureDownloadHref } from '@/src/data/mockData';
import { getCatalogProductBySlug } from '@/src/lib/catalog';
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

  const product = await getCatalogProductBySlug(slug);

  if (!product || product.status !== 'ACTIVE' || product.isPushed === false) {
    notFound();
  }

  const [storefrontLookup, rawReviews] = await Promise.all([
    getStorefrontProductByHandle(product.shopifyHandle ?? product.slug)
      .then((value) => ({ storefrontProduct: value, storefrontError: null as string | null }))
      .catch((error) => ({
        storefrontProduct: null,
        storefrontError: error instanceof Error ? error.message : 'Unknown Shopify Storefront error.',
      })),
    listProductReviews(slug),
  ]);

  const { storefrontProduct, storefrontError } = storefrontLookup;
  const reviews = rawReviews.map((review) => ({
    id: review.id,
    customerName: review.customerName,
    rating: review.rating,
    comment: review.comment,
    adminReply: review.adminReply,
    adminReplyBy: review.adminReplyBy,
    adminReplyAt: review.adminReplyAt,
    createdAt: review.createdAt,
  }));
  const publicSession = authenticatedCustomerSession?.customer
    ? {
        id: authenticatedCustomerSession.customer.id,
        email: authenticatedCustomerSession.customer.email,
        name: authenticatedCustomerSession.customer.name,
        photoURL: authenticatedCustomerSession.customer.photoURL,
      }
    : null;

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
          initialSession={publicSession}
        />
      </div>
    </>
  );
}
