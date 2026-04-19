import ReviewModerationPanel from '@/components/admin/ReviewModerationPanel';
import { listAllProductReviews } from '@/lib/customer-store';
import { listCatalogProducts } from '@/src/lib/catalog';

export default async function ReviewsAdminPage() {
  const [reviews, catalogProducts] = await Promise.all([listAllProductReviews(), listCatalogProducts()]);
  const productNameBySlug = new Map(catalogProducts.map((product) => [product.slug, product.name] as const));

  const initialReviews = reviews.map((review) => ({
    id: review.id,
    productSlug: review.productSlug,
    productName: productNameBySlug.get(review.productSlug) ?? review.productSlug,
    customerName: review.customerName,
    customerEmail: review.customerEmail,
    customerPhone: review.customerPhone,
    rating: review.rating,
    comment: review.comment,
    adminReply: review.adminReply,
    adminReplyBy: review.adminReplyBy,
    adminReplyAt: review.adminReplyAt ? review.adminReplyAt.toISOString() : null,
    createdAt: review.createdAt.toISOString(),
  }));

  return (
    <section className="mx-auto max-w-[1600px]">
      <ReviewModerationPanel initialReviews={initialReviews} />
    </section>
  );
}
