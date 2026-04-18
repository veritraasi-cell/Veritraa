import { NextRequest } from 'next/server';
import { revokeAdminSession } from '@/lib/auth/middleware';
import { clearAdminSessionCookie, SESSION_COOKIE_NAME } from '@/lib/auth/config';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    await revokeAdminSession(token);

    const response = successResponse({ ok: true }, { logout: true });
    response.cookies.set(clearAdminSessionCookie());
    return response;
  } catch (error) {
    const response = errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to sign out.', 500);
    response.cookies.set(clearAdminSessionCookie());
    return response;
  }
}
