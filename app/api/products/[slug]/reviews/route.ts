import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { createProductReview, listProductReviews } from '@/lib/customer-store';

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSession(cookieStore);

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Please log in before viewing reviews.' }, { status: 401 });
  }

  const reviews = await listProductReviews(slug);
  return NextResponse.json({ ok: true, data: { reviews } });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSession(cookieStore);

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Please log in before posting a review.' }, { status: 401 });
  }

  const body = (await request.json()) as { rating?: number; comment?: string };
  if (!body.comment?.trim() || !body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ ok: false, error: 'Rating and comment are required.' }, { status: 422 });
  }

  const review = await createProductReview({
    productSlug: slug,
    customerId: session.customer.id,
    customerName: session.customer.name,
    customerEmail: session.customer.email,
    customerPhone: session.customer.phone,
    customerPhotoURL: session.customer.photoURL,
    rating: body.rating,
    comment: body.comment.trim(),
  });

  return NextResponse.json({ ok: true, data: { review } });
}
