import 'server-only';

import { randomUUID } from 'crypto';
import type { AdminRole, AdminSession, AdminUser } from '@/lib/auth/types';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import {
  buildAdminSessionCookie,
  signAdminJwt,
  verifyAdminJwt,
} from '@/lib/auth/config';

const DEV_ADMIN_EMAIL = 'admin@veritraa.in';
const DEV_ADMIN_ID = 'dev-super-admin';
const DEV_ADMIN_NAME = 'Veritraa Admin';
const DEV_ADMIN_PASSWORD = 'admin123456';

let devAdminPromise: Promise<AdminUser> | null = null;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function getDevAdminUser() {
  if (!devAdminPromise) {
    devAdminPromise = (async () => {
      const passwordHash = await hashPassword(DEV_ADMIN_PASSWORD);

      return {
        id: DEV_ADMIN_ID,
        email: DEV_ADMIN_EMAIL,
        passwordHash,
        name: DEV_ADMIN_NAME,
        role: 'SUPER_ADMIN' as AdminRole,
        avatar: null,
        isActive: true,
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } satisfies AdminUser;
    })();
  }

  return devAdminPromise;
}

async function getAdminByEmailFromStore(email: string) {
  const normalizedEmail = normalizeEmail(email);

  if (normalizedEmail === DEV_ADMIN_EMAIL) {
    return getDevAdminUser();
  }

  return null;
}

async function getAdminByIdFromStore(adminId: string) {
  if (adminId === DEV_ADMIN_ID) {
    return getDevAdminUser();
  }

  return null;
}

export type AdminSessionContext = {
  admin: Omit<AdminUser, 'passwordHash'>;
  session: AdminSession;
};

function sanitizeAdmin(admin: AdminUser): Omit<AdminUser, 'passwordHash'> {
  const { passwordHash, ...rest } = admin;
  void passwordHash;
  return rest;
}

export async function authenticateAdminCredentials(email: string, password: string) {
  const admin = await getAdminByEmailFromStore(email);

  if (!admin || !admin.isActive) {
    return null;
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  return sanitizeAdmin(admin);
}

export async function createAdminSession(
  admin: Omit<AdminUser, 'passwordHash'>,
  options: {
    rememberMe?: boolean;
    ipAddress?: string | null;
    userAgent?: string | null;
  } = {}
) {
  const rememberMe = Boolean(options.rememberMe);
  const sessionToken = randomUUID();
  const expiresAt = new Date(Date.now() + (rememberMe ? 7 : 1) * 24 * 60 * 60 * 1000);
  const jwt = await signAdminJwt(
    {
      sessionToken,
      adminId: admin.id,
      role: admin.role,
      rememberMe,
    },
    expiresAt
  );

  return {
    token: jwt,
    cookie: buildAdminSessionCookie(jwt, rememberMe),
    session: {
      id: sessionToken,
      sessionToken,
      adminId: admin.id,
      expiresAt,
      ipAddress: options.ipAddress ?? null,
      userAgent: options.userAgent ?? null,
      createdAt: new Date(),
    } satisfies AdminSession,
  };
}

export async function getAdminSessionFromToken(token?: string | null): Promise<AdminSessionContext | null> {
  if (!token) {
    return null;
  }

  let decoded: Awaited<ReturnType<typeof verifyAdminJwt>>;

  try {
    decoded = await verifyAdminJwt(token);
  } catch {
    return null;
  }

  if (!decoded.sessionToken || !decoded.adminId) {
    return null;
  }

  if (decoded.expiresAt && decoded.expiresAt < new Date()) {
    return null;
  }

  const admin = await getAdminByIdFromStore(decoded.adminId);
  if (!admin || !admin.isActive) {
    return null;
  }

  const session: AdminSession = {
    id: decoded.sessionToken,
    sessionToken: decoded.sessionToken,
    adminId: admin.id,
    expiresAt: decoded.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
  };

  return {
    admin: sanitizeAdmin(admin),
    session,
  };
}

export async function getCurrentAdminSession(cookieStore: {
  get(name: string): { value: string } | undefined;
}) {
  const token = cookieStore.get('admin_session')?.value;
  return getAdminSessionFromToken(token);
}

export async function revokeAdminSession(token?: string | null) {
  if (!token) {
    return;
  }

  try {
    await verifyAdminJwt(token);
  } catch {
    // ignore invalid tokens
  }
}
