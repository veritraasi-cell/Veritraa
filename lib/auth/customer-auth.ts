import 'server-only';

import type { DecodedIdToken } from 'firebase-admin/auth';
import { getFirebaseAdminAuth } from '@/lib/firebase/admin';
import {
  findCustomerById,
  upsertCustomerProfile,
  type CustomerAccount,
} from '@/lib/customer-store';

export const CUSTOMER_SESSION_COOKIE_NAME = 'veritraa_customer_session';
const CUSTOMER_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function buildCustomerSessionCookie(value: string) {
  return {
    name: CUSTOMER_SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(CUSTOMER_SESSION_DURATION_MS / 1000),
  };
}

export function clearCustomerSessionCookie() {
  return {
    name: CUSTOMER_SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
}

function getProviderIds(decoded: DecodedIdToken) {
  const provider = decoded.firebase?.sign_in_provider;
  return typeof provider === 'string' && provider.length > 0 ? [provider] : [];
}

function getProfilePayload(decoded: DecodedIdToken, overrides?: { phone?: string | null; name?: string | null }) {
  const email = typeof decoded.email === 'string' ? decoded.email : '';
  const name = overrides?.name ?? (typeof decoded.name === 'string' ? decoded.name : 'Customer');
  const phoneNumber = (decoded as { phone_number?: string }).phone_number;
  const phone = overrides?.phone ?? (typeof phoneNumber === 'string' ? phoneNumber : null);
  const photoURL = typeof decoded.picture === 'string' ? decoded.picture : null;

  return {
    uid: decoded.uid,
    email,
    name,
    phone,
    photoURL,
    providerIds: getProviderIds(decoded),
    lastLoginAt: new Date(),
  };
}

async function syncCustomerProfile(decoded: DecodedIdToken, overrides?: { phone?: string | null; name?: string | null }) {
  const payload = getProfilePayload(decoded, overrides);
  return upsertCustomerProfile(payload);
}

export async function createCustomerLoginSession(input: {
  idToken: string;
  phone?: string | null;
  name?: string | null;
}) {
  const auth = getFirebaseAdminAuth();
  const decoded = await auth.verifyIdToken(input.idToken);
  const sessionToken = await auth.createSessionCookie(input.idToken, {
    expiresIn: CUSTOMER_SESSION_DURATION_MS,
  });
  const customer = await syncCustomerProfile(decoded, {
    phone: input.phone ?? null,
    name: input.name ?? null,
  });

  return {
    token: sessionToken,
    cookie: buildCustomerSessionCookie(sessionToken),
    customer,
    session: {
      expiresAt: new Date(Date.now() + CUSTOMER_SESSION_DURATION_MS),
    },
  };
}

export async function getCurrentCustomerSession(cookieStore: {
  get(name: string): { value: string } | undefined;
}) {
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifySessionCookie(token, true);
    const customer = (await findCustomerById(decoded.uid)) ?? (await syncCustomerProfile(decoded));

    return {
      customer,
      session: {
        expiresAt: new Date((decoded.exp ?? Math.floor(Date.now() / 1000)) * 1000),
      },
    };
  } catch {
    return null;
  }
}

export async function revokeCustomerLoginSession(token?: string | null) {
  if (!token) {
    return;
  }

  try {
    const auth = getFirebaseAdminAuth();
    const decoded = await auth.verifySessionCookie(token, true);
    await auth.revokeRefreshTokens(decoded.uid);
  } catch {
    // Ignore invalid or expired cookies.
  }
}

export async function updateCustomerPhone(customerId: string, phone: string) {
  const customer = await findCustomerById(customerId);

  if (!customer) {
    throw new Error('Customer profile not found.');
  }

  return upsertCustomerProfile({
    uid: customer.uid,
    email: customer.email,
    name: customer.name,
    phone,
    photoURL: customer.photoURL,
    providerIds: customer.providerIds,
    lastLoginAt: customer.lastLoginAt ?? new Date(),
  });
}

export type { CustomerAccount } from '@/lib/customer-store';
