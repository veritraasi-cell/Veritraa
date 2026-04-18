import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/auth/config';

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated.',
        details: null,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);
  headers.set('x-admin-path', pathname);

  if (pathname.startsWith('/admin')) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (pathname !== '/admin/login' && !hasSession) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  if (pathname.startsWith('/api/admin')) {
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (!hasSession) {
      return unauthorizedResponse();
    }

    return NextResponse.next({
      request: {
        headers,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
