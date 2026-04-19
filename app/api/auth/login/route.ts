import { NextRequest } from 'next/server';
import { authenticateAdminCredentials, createAdminSession } from '@/lib/auth/middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { adminLoginSchema } from '@/lib/utils/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse('VALIDATION_ERROR', parsed.error.issues[0]?.message ?? 'Invalid login data.', 422, parsed.error.flatten());
    }

    const admin = await authenticateAdminCredentials(parsed.data.email, parsed.data.password);

    if (!admin) {
      return errorResponse('UNAUTHORIZED', 'Invalid email or password.', 401);
    }

    const session = await createAdminSession(admin, {
      rememberMe: parsed.data.rememberMe,
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      userAgent: request.headers.get('user-agent'),
    });

    const response = successResponse(
      {
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          avatar: admin.avatar,
          isActive: admin.isActive,
        },
        expiresAt: session.session.expiresAt.toISOString(),
      },
      { login: true }
    );

    response.cookies.set(session.cookie);
    return response;
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unable to sign in.', 500);
  }
}
