import { NextRequest } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  const session = await getCurrentCustomerSession(request.cookies);
  if (!session) {
    return errorResponse('UNAUTHORIZED', 'No active customer session.', 401);
  }

  return successResponse({
    customer: session.customer,
    expiresAt: session.session.expiresAt.toISOString(),
  });
}
