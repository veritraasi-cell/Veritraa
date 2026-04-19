import type { ReactNode } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { getCurrentAdminSession } from '@/lib/auth/middleware';
import {
  ensureShopifyOrderWebhookSubscriptions,
  resolveShopifyWebhookBaseUrl,
} from '@/src/lib/shopifyAdmin';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headerStore = await headers();
  const cookieStore = await cookies();
  const adminPath = headerStore.get('x-admin-path') ?? '/admin';
  const session = await getCurrentAdminSession(cookieStore);
  const isLoginRoute = adminPath === '/admin/login';

  if (isLoginRoute && session) {
    redirect('/admin');
  }

  if (!isLoginRoute && !session) {
    redirect('/admin/login');
  }

  if (isLoginRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!session) {
    redirect('/admin/login');
  }

  try {
    const webhookBaseUrl = resolveShopifyWebhookBaseUrl(headerStore);

    if (webhookBaseUrl) {
      await ensureShopifyOrderWebhookSubscriptions(webhookBaseUrl);
    }
  } catch (error) {
    console.warn('Shopify webhook auto-registration skipped:', error);
  }

  return (
    <AdminShell currentPath={adminPath} adminName={session.admin.name} adminRole={session.admin.role} notificationsCount={0}>
      {children}
    </AdminShell>
  );
}
