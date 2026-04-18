import type { AdminRole } from '@/lib/auth/types';

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  SUPER_ADMIN: [
    'dashboard.view',
    'products.manage',
    'orders.manage',
    'orders.refund',
    'customers.manage',
    'discounts.manage',
    'analytics.view',
    'settings.manage',
    'users.manage',
    'data.delete',
    'logs.view',
    'shipping.manage',
    'cms.manage',
  ],
  ADMIN: [
    'dashboard.view',
    'products.manage',
    'orders.manage',
    'orders.refund',
    'customers.manage',
    'discounts.manage',
    'analytics.view',
    'settings.manage',
    'data.delete',
    'logs.view',
    'shipping.manage',
    'cms.manage',
  ],
  MANAGER: [
    'dashboard.view',
    'products.manage',
    'orders.manage',
    'customers.manage',
    'discounts.manage',
    'analytics.view',
    'logs.view',
    'shipping.manage',
    'cms.manage',
  ],
  STAFF: ['dashboard.view', 'products.manage', 'orders.manage', 'analytics.view', 'cms.manage'],
  VIEWER: ['dashboard.view', 'analytics.view'],
};
