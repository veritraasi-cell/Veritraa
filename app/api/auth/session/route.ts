import { NextRequest } from 'next/server';
import { getAdminSessionFromToken } from '@/lib/auth/middleware';
import { SESSION_COOKIE_NAME } from '@/lib/auth/config';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await getAdminSessionFromToken(token);

  if (!session) {
    return errorResponse('UNAUTHORIZED', 'No active admin session.', 401);
  }

  return successResponse({
    admin: {
      id: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role,
      avatar: session.admin.avatar,
      isActive: session.admin.isActive,
    },
    expiresAt: session.session.expiresAt.toISOString(),
  });
}
