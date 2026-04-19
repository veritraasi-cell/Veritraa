import { NextRequest } from 'next/server';
import { getCurrentAdminSession } from '@/lib/auth/middleware';
import {
  deleteProductReview,
  listAllProductReviews,
  updateProductReviewReply,
} from '@/lib/customer-store';
import { errorResponse, successResponse } from '@/lib/utils/api-response';

type ReviewActionBody = {
  productSlug?: string;
  reviewId?: string;
  reply?: string | null;
};

async function readBody(request: NextRequest) {
  try {
    return (await request.json()) as ReviewActionBody;
  } catch {
    return {} as ReviewActionBody;
  }
}

export async function GET(request: NextRequest) {
  const session = await getCurrentAdminSession(request.cookies);

  if (!session) {
    return errorResponse('UNAUTHORIZED', 'No active admin session.', 401);
  }

  const reviews = await listAllProductReviews();
  return successResponse({ reviews });
}

export async function PATCH(request: NextRequest) {
  const session = await getCurrentAdminSession(request.cookies);

  if (!session) {
    return errorResponse('UNAUTHORIZED', 'No active admin session.', 401);
  }

  const body = await readBody(request);
  const productSlug = body.productSlug?.trim();
  const reviewId = body.reviewId?.trim();

  if (!productSlug || !reviewId) {
    return errorResponse('VALIDATION_ERROR', 'Product slug and review id are required.', 422);
  }

  try {
    const review = await updateProductReviewReply({
      productSlug,
      reviewId,
      reply: typeof body.reply === 'string' ? body.reply : null,
      adminName: session.admin.name,
    });

    return successResponse({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update review.';
    const isNotFound = message.toLowerCase().includes('not found');
    return errorResponse(isNotFound ? 'NOT_FOUND' : 'INTERNAL_ERROR', message, isNotFound ? 404 : 500);
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getCurrentAdminSession(request.cookies);

  if (!session) {
    return errorResponse('UNAUTHORIZED', 'No active admin session.', 401);
  }

  const body = await readBody(request);
  const productSlug = body.productSlug?.trim();
  const reviewId = body.reviewId?.trim();

  if (!productSlug || !reviewId) {
    return errorResponse('VALIDATION_ERROR', 'Product slug and review id are required.', 422);
  }

  try {
    const review = await deleteProductReview({
      productSlug,
      reviewId,
    });

    return successResponse({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete review.';
    const isNotFound = message.toLowerCase().includes('not found');
    return errorResponse(isNotFound ? 'NOT_FOUND' : 'INTERNAL_ERROR', message, isNotFound ? 404 : 500);
  }
}