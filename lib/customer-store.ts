import 'server-only';

import { randomUUID } from 'crypto';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { getFirebaseAdminDb } from '@/lib/firebase/admin';

export interface CustomerAccount {
  id: string;
  uid: string;
  email: string;
  name: string;
  phone: string | null;
  photoURL: string | null;
  providerIds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface ProductReview {
  id: string;
  productSlug: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerPhotoURL: string | null;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductLike {
  id: string;
  productSlug: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  createdAt: Date;
}

export interface CustomerOrderLineItem {
  title: string;
  quantity: number;
  amount: string;
  currencyCode: string;
}

export interface CustomerOrderSnapshot {
  id: string;
  shopifyOrderId: string;
  orderName: string;
  customerId: string | null;
  customerEmail: string;
  customerPhone: string | null;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string | null;
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  lineItems: CustomerOrderLineItem[];
  createdAt: Date;
  rawOrder: Record<string, unknown>;
}

function customersCollection() {
  return getFirebaseAdminDb().collection('customers');
}

function productReviewsCollection(productSlug: string) {
  return getFirebaseAdminDb().collection('products').doc(productSlug).collection('reviews');
}

function productLikesCollection(productSlug: string) {
  return getFirebaseAdminDb().collection('products').doc(productSlug).collection('likes');
}

function customerOrdersCollection(customerId: string) {
  return customersCollection().doc(customerId).collection('orders');
}

function guestOrdersCollection() {
  return getFirebaseAdminDb().collection('guestOrders');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toDate(value: unknown) {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }

  return null;
}

function mapCustomerAccount(snapshot: QueryDocumentSnapshot<DocumentData>) {
  const data = snapshot.data() as Partial<CustomerAccount>;

  return {
    id: snapshot.id,
    uid: snapshot.id,
    email: normalizeEmail(String(data.email ?? '')),
    name: String(data.name ?? '').trim(),
    phone: typeof data.phone === 'string' && data.phone.trim() ? data.phone.trim() : null,
    photoURL: typeof data.photoURL === 'string' && data.photoURL.trim() ? data.photoURL.trim() : null,
    providerIds: Array.isArray(data.providerIds)
      ? data.providerIds.filter((value): value is string => typeof value === 'string' && value.length > 0)
      : [],
    createdAt: toDate(data.createdAt) ?? new Date(),
    updatedAt: toDate(data.updatedAt) ?? new Date(),
    lastLoginAt: toDate(data.lastLoginAt),
  } satisfies CustomerAccount;
}

function mapProductReview(snapshot: QueryDocumentSnapshot<DocumentData>) {
  const data = snapshot.data() as Partial<ProductReview>;

  return {
    id: snapshot.id,
    productSlug: String(data.productSlug ?? ''),
    customerId: String(data.customerId ?? ''),
    customerName: String(data.customerName ?? '').trim(),
    customerEmail: normalizeEmail(String(data.customerEmail ?? '')),
    customerPhone: typeof data.customerPhone === 'string' && data.customerPhone.trim() ? data.customerPhone.trim() : null,
    customerPhotoURL:
      typeof data.customerPhotoURL === 'string' && data.customerPhotoURL.trim()
        ? data.customerPhotoURL.trim()
        : null,
    rating: Number(data.rating ?? 0),
    comment: String(data.comment ?? '').trim(),
    createdAt: toDate(data.createdAt) ?? new Date(),
  } satisfies ProductReview;
}

function mapCustomerOrder(snapshot: QueryDocumentSnapshot<DocumentData>) {
  const data = snapshot.data() as Partial<CustomerOrderSnapshot>;

  return {
    id: snapshot.id,
    shopifyOrderId: String(data.shopifyOrderId ?? snapshot.id),
    orderName: String(data.orderName ?? snapshot.id),
    customerId: typeof data.customerId === 'string' ? data.customerId : null,
    customerEmail: normalizeEmail(String(data.customerEmail ?? '')),
    customerPhone: typeof data.customerPhone === 'string' && data.customerPhone.trim() ? data.customerPhone.trim() : null,
    displayFinancialStatus: String(data.displayFinancialStatus ?? 'unknown'),
    displayFulfillmentStatus:
      typeof data.displayFulfillmentStatus === 'string' && data.displayFulfillmentStatus.trim()
        ? data.displayFulfillmentStatus.trim()
        : null,
    totalAmount: {
      amount: String(data.totalAmount?.amount ?? '0'),
      currencyCode: String(data.totalAmount?.currencyCode ?? 'INR'),
    },
    lineItems: Array.isArray(data.lineItems)
      ? data.lineItems
          .map((item) => ({
            title: String(item.title ?? '').trim(),
            quantity: Number(item.quantity ?? 0),
            amount: String(item.amount ?? '0'),
            currencyCode: String(item.currencyCode ?? 'INR'),
          }))
          .filter((item) => item.title.length > 0)
      : [],
    createdAt: toDate(data.createdAt) ?? new Date(),
    rawOrder: (data.rawOrder as Record<string, unknown>) ?? {},
  } satisfies CustomerOrderSnapshot;
}

export async function findCustomerByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const snapshot = await customersCollection().where('email', '==', normalizedEmail).limit(1).get();

  if (snapshot.empty) {
    return null;
  }

  return mapCustomerAccount(snapshot.docs[0]);
}

export async function findCustomerById(id: string) {
  const snapshot = await customersCollection().doc(id).get();

  if (!snapshot.exists) {
    return null;
  }

  return mapCustomerAccount(snapshot as QueryDocumentSnapshot<DocumentData>);
}

export async function upsertCustomerProfile(input: {
  uid: string;
  email: string;
  name: string;
  phone?: string | null;
  photoURL?: string | null;
  providerIds?: string[];
  lastLoginAt?: Date;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const customerRef = customersCollection().doc(input.uid);
  const snapshot = await customerRef.get();
  const existing = snapshot.exists ? mapCustomerAccount(snapshot as QueryDocumentSnapshot<DocumentData>) : null;
  const now = new Date();

  const account: CustomerAccount = {
    id: input.uid,
    uid: input.uid,
    email: normalizedEmail,
    name: input.name.trim() || existing?.name || normalizedEmail.split('@')[0] || 'Customer',
    phone:
      typeof input.phone === 'string'
        ? input.phone.trim() || null
        : existing?.phone ?? null,
    photoURL:
      typeof input.photoURL === 'string'
        ? input.photoURL.trim() || null
        : existing?.photoURL ?? null,
    providerIds: Array.from(new Set([...(existing?.providerIds ?? []), ...(input.providerIds ?? [])])),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    lastLoginAt: input.lastLoginAt ?? existing?.lastLoginAt ?? now,
  };

  await customerRef.set(account, { merge: true });
  return account;
}

export async function updateCustomerPhone(customerId: string, phone: string) {
  const existing = await findCustomerById(customerId);

  if (!existing) {
    throw new Error('Customer profile not found.');
  }

  const updated = {
    ...existing,
    phone: phone.trim(),
    updatedAt: new Date(),
  } satisfies CustomerAccount;

  await customersCollection().doc(customerId).set(updated, { merge: true });
  return updated;
}

export async function listProductReviews(productSlug: string) {
  const snapshot = await productReviewsCollection(productSlug).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((entry) => mapProductReview(entry));
}

export async function createProductReview(input: Omit<ProductReview, 'id' | 'createdAt'>) {
  const id = randomUUID();
  const review: ProductReview = {
    id,
    ...input,
    customerPhone: input.customerPhone?.trim() ?? null,
    customerPhotoURL: input.customerPhotoURL?.trim() ?? null,
    createdAt: new Date(),
  };

  await productReviewsCollection(input.productSlug).doc(id).set(review);
  return review;
}

export async function getProductLikeSummary(productSlug: string, customerId: string | null) {
  const likesCollection = productLikesCollection(productSlug);
  const [likesSnapshot, customerLikeSnapshot] = await Promise.all([
    likesCollection.get(),
    customerId ? likesCollection.doc(customerId).get() : Promise.resolve(null),
  ]);

  return {
    totalLikes: likesSnapshot.size,
    liked: Boolean(customerLikeSnapshot?.exists),
  };
}

export async function toggleProductLike(input: {
  productSlug: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
}) {
  const likesCollection = productLikesCollection(input.productSlug);
  const likeRef = likesCollection.doc(input.customerId);
  const snapshot = await likeRef.get();

  if (snapshot.exists) {
    await likeRef.delete();
  } else {
    const like: ProductLike = {
      id: input.customerId,
      productSlug: input.productSlug,
      customerId: input.customerId,
      customerName: input.customerName,
      customerEmail: normalizeEmail(input.customerEmail),
      customerPhone: input.customerPhone,
      createdAt: new Date(),
    };

    await likeRef.set(like);
  }

  return getProductLikeSummary(input.productSlug, input.customerId);
}

export async function storeCustomerOrderSnapshot(input: {
  shopifyOrderId: string;
  orderName: string;
  customerId: string | null;
  customerEmail: string;
  customerPhone: string | null;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string | null;
  totalAmount: {
    amount: string;
    currencyCode: string;
  };
  lineItems: CustomerOrderLineItem[];
  rawOrder: Record<string, unknown>;
}) {
  const order: CustomerOrderSnapshot = {
    id: input.shopifyOrderId,
    shopifyOrderId: input.shopifyOrderId,
    orderName: input.orderName,
    customerId: input.customerId,
    customerEmail: normalizeEmail(input.customerEmail),
    customerPhone: input.customerPhone,
    displayFinancialStatus: input.displayFinancialStatus,
    displayFulfillmentStatus: input.displayFulfillmentStatus,
    totalAmount: input.totalAmount,
    lineItems: input.lineItems,
    createdAt: new Date(),
    rawOrder: input.rawOrder,
  };

  if (input.customerId) {
    await customerOrdersCollection(input.customerId).doc(input.shopifyOrderId).set(order, { merge: true });
    return order;
  }

  await guestOrdersCollection().doc(input.shopifyOrderId).set(order, { merge: true });
  return order;
}

export async function listCustomerOrders(customerId: string) {
  const snapshot = await customerOrdersCollection(customerId).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((entry) => mapCustomerOrder(entry));
}
