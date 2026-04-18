import { NextRequest } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { upsertCustomerProfile } from '@/lib/customer-store';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentCustomerSession(request.cookies);
    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please log in first.', 401);
    }

    const body = (await request.json()) as {
      name?: string;
      phone?: string;
    };

    const customer = await upsertCustomerProfile({
      uid: session.customer.id,
      email: session.customer.email,
      name: body.name?.trim() || session.customer.name,
      phone: body.phone?.trim() || session.customer.phone,
      photoURL: session.customer.photoURL,
      providerIds: session.customer.providerIds,
      lastLoginAt: new Date(),
    });

    return successResponse({ customer });
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to register.', 500);
  }
}
