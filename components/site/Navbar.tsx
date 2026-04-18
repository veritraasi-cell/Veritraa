'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LogOut, Menu, Search, ShoppingBag, UserCircle2, X } from 'lucide-react';
import { useCart } from '@/components/site/CartProvider';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';
import { navLinks } from '@/src/data/mockData';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { customer, isAuthenticated, openAuthDialog, logout, authBusy } = useFirebaseCustomerAuth();
  const itemCount = cart?.totalQuantity ?? 0;

  return (
    <nav className="glass-nav fixed top-0 z-50 w-full border-b border-outline-variant/30 shadow-[0_10px_30px_-24px_rgba(26,28,26,0.75)]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3 md:gap-4 md:px-8 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3">
          <Image 
            src="/logo.png" 
            alt="Veritraa Enterprises" 
            height={96} 
            width={96}
            className="h-12 w-12 rounded-full object-cover shadow-sm sm:h-16 sm:w-16 md:h-20 md:w-20"
            priority
          />
          <div className="hidden sm:flex flex-col gap-0.5">
            <span className="text-[9px] md:text-[10px] font-bold text-primary/90 leading-none tracking-wider">PURE.</span>
            <span className="text-[9px] md:text-[10px] font-bold text-primary/90 leading-none tracking-wider">TRUE.</span>
            <span className="text-[9px] md:text-[10px] font-bold text-primary/90 leading-none tracking-wider">TRUSTED.</span>
          </div>
        </Link>

        <div className="hidden items-center gap-12 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                className={`border-b-2 pb-2 font-body text-sm font-medium tracking-tight transition-all duration-300 ease-out ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-background opacity-75 hover:text-primary hover:opacity-100'
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-8 md:flex shrink-0">
          <button
            aria-label="Search products"
            className="cursor-pointer text-on-background transition-all hover:text-primary hover:scale-110"
            type="button"
          >
            <Search size={20} />
          </button>
          <Link
            aria-label="Shopping bag"
            className="relative cursor-pointer text-on-background transition-all hover:text-primary hover:scale-110"
            href="/cart"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 ? (
              <span className="absolute -right-2 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-md">
                {itemCount}
              </span>
            ) : null}
          </Link>
          {isAuthenticated && customer ? (
            <div className="flex items-center gap-3 rounded-full border border-[#dcbfa6] bg-white/80 px-3 py-2 text-sm text-[#4b2616] shadow-sm">
              <UserCircle2 size={18} className="text-[#8a3a17]" />
              <span className="max-w-[160px] truncate font-semibold">{customer.name}</span>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-[#8a3a17] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#6f2507] disabled:opacity-60"
                disabled={authBusy}
                onClick={() => {
                  void logout();
                }}
                type="button"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <button
              className="spice-gradient rounded-full px-6 py-2.5 text-xs md:text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105"
              onClick={openAuthDialog}
              type="button"
            >
              Login with Google
            </button>
          )}
        </div>

        <button
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
          className="text-on-background md:hidden"
          onClick={() => setMobileMenuOpen((value) => !value)}
          type="button"
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-outline-variant/30 bg-[#fff8f0]/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                className={`font-body text-base ${
                  pathname === link.href ? 'text-primary' : 'text-on-background opacity-80'
                }`}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <button
                aria-label="Search products"
                className="text-on-background"
                type="button"
              >
                <Search size={18} />
              </button>
              <Link
                aria-label="Shopping bag"
                className="relative text-on-background"
                href="/cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
              {isAuthenticated && customer ? (
                <button
                  className="spice-gradient rounded-full px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-60"
                  disabled={authBusy}
                  onClick={() => {
                    void logout();
                  }}
                  type="button"
                >
                  Logout
                </button>
              ) : (
                <button
                  className="spice-gradient rounded-full px-4 py-2 text-xs font-medium text-on-primary"
                  onClick={openAuthDialog}
                  type="button"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
