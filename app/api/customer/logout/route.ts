import { NextRequest } from 'next/server';
import { clearCustomerSessionCookie, CUSTOMER_SESSION_COOKIE_NAME, revokeCustomerLoginSession } from '@/lib/auth/customer-auth';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;
    await revokeCustomerLoginSession(token);

    const response = successResponse({ ok: true });
    response.cookies.set(clearCustomerSessionCookie());
    return response;
  } catch (error) {
    const response = errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to sign out.', 500);
    response.cookies.set(clearCustomerSessionCookie());
    return response;
  }
}
