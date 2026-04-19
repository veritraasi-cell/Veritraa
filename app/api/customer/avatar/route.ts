import { NextRequest, NextResponse } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';

export const runtime = 'nodejs';

function error(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(request: NextRequest) {
  const session = await getCurrentCustomerSession(request.cookies);

  if (!session) {
    return error('No active customer session.', 401);
  }

  const photoURL = session.customer.photoURL?.trim();

  if (!photoURL) {
    return error('Customer profile photo not available.', 404);
  }

  try {
    const response = await fetch(photoURL, {
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok || !response.body) {
      return error('Unable to load profile photo.', 502);
    }

    const headers = new Headers();
    const contentType = response.headers.get('content-type');

    if (contentType) {
      headers.set('content-type', contentType);
    }

    headers.set('cache-control', 'private, no-store');

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return error('Unable to load profile photo.', 502);
  }
}