import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import type { AdminRole } from '@/lib/auth/types';

export const SESSION_COOKIE_NAME = 'admin_session';
const DEFAULT_SESSION_SECONDS = 60 * 60 * 24;
const REMEMBER_ME_SESSION_SECONDS = 60 * 60 * 24 * 7;
const DEFAULT_AUTH_SECRET = 'veritraa-admin-development-secret';

function getAuthSecret() {
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? DEFAULT_AUTH_SECRET;
}

function getJwtKey() {
  return new TextEncoder().encode(getAuthSecret());
}

export interface AdminJwtPayload {
  sessionToken: string;
  adminId: string;
  role: AdminRole;
  rememberMe: boolean;
}

export function getSessionMaxAgeSeconds(rememberMe = false) {
  return rememberMe ? REMEMBER_ME_SESSION_SECONDS : DEFAULT_SESSION_SECONDS;
}

export function buildAdminSessionCookie(value: string, rememberMe = false) {
  return {
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getSessionMaxAgeSeconds(rememberMe),
  };
}

export function clearAdminSessionCookie() {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}

export async function signAdminJwt(payload: AdminJwtPayload, expiresAt: Date) {
  return new SignJWT({
    role: payload.role,
    rememberMe: payload.rememberMe,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.adminId)
    .setJti(payload.sessionToken)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getJwtKey());
}

export async function verifyAdminJwt(token: string) {
  const { payload } = await jwtVerify(token, getJwtKey());
  const expiresAt = typeof payload.exp === 'number' ? new Date(payload.exp * 1000) : null;

  return {
    sessionToken: typeof payload.jti === 'string' ? payload.jti : '',
    adminId: typeof payload.sub === 'string' ? payload.sub : '',
    role: (typeof payload.role === 'string' ? payload.role : 'STAFF') as AdminRole,
    rememberMe: Boolean(payload.rememberMe),
    expiresAt,
  };
}

