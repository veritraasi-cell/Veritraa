import { NextRequest } from 'next/server';
import { getCurrentCustomerSession } from '@/lib/auth/customer-auth';
import { listCustomerOrders } from '@/lib/customer-store';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentCustomerSession(request.cookies);

    if (!session) {
      return errorResponse('UNAUTHORIZED', 'Please log in first.', 401);
    }

    const orders = await listCustomerOrders(session.customer.id);
    return successResponse({ orders });
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to load orders.', 500);
  }
}