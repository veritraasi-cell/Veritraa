import { NextRequest } from 'next/server';
import { createCustomerLoginSession } from '@/lib/auth/customer-auth';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idToken?: string; phone?: string; name?: string };

    if (!body.idToken) {
      return errorResponse('VALIDATION_ERROR', 'A Firebase ID token is required.', 422);
    }

    const session = await createCustomerLoginSession({
      idToken: body.idToken,
      phone: body.phone?.trim() ?? null,
      name: body.name?.trim() ?? null,
    });

    const response = successResponse({
      customer: session.customer,
      expiresAt: session.session.expiresAt.toISOString(),
    });
    response.cookies.set(session.cookie);
    return response;
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to sign in.', 500);
  }
}
