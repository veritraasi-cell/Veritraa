import 'server-only';

/**
 * Firebase is the primary database for this application.
 * Prisma has been deprecated in favor of Firebase Firestore.
 * 
 * For admin authentication and data storage, use Firebase modules:
 * - @/lib/firebase/admin - Firebase Admin SDK
 * - @/lib/firebase/admin-auth-store - Admin authentication
 * - @/lib/firebase/catalog-store - Product catalog
 * - @/lib/firebase/customer-store - Customer data
 */

export const prisma = null;

export default prisma;
