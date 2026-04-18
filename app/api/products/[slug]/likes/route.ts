import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { getProductLikeSummary, toggleProductLike } from '@/lib/customer-store';

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
    return NextResponse.json({ ok: false, error: 'Please log in before viewing likes.' }, { status: 401 });
  }

  const summary = await getProductLikeSummary(slug, session.customer.id);
  return NextResponse.json({ ok: true, data: summary });
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const cookieStore = await cookies();
  const session = await getCurrentCustomerSession(cookieStore);

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Please log in before liking products.' }, { status: 401 });
  }

  const summary = await toggleProductLike({
    productSlug: slug,
    customerId: session.customer.id,
    customerName: session.customer.name,
    customerEmail: session.customer.email,
    customerPhone: session.customer.phone,
  });

  return NextResponse.json({ ok: true, data: summary });
}