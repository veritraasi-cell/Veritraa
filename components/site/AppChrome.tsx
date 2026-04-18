'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Navbar from '@/components/site/Navbar';
import SiteFooter from '@/components/site/SiteFooter';
import { CartProvider } from '@/components/site/CartProvider';
import { FirebaseAuthProvider } from '@/components/site/FirebaseAuthProvider';

export default function AppChrome({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-transparent pt-0">{children}</main>;
  }

  return (
    <FirebaseAuthProvider>
      <CartProvider>
        <Navbar />
        <main className="content-frame min-h-screen pt-[72px] sm:pt-[78px] md:pt-[92px]">{children}</main>
        <SiteFooter />
      </CartProvider>
    </FirebaseAuthProvider>
  );
}
