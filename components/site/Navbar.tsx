'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, ShoppingBag, UserCircle2, X } from 'lucide-react';
import { useCart } from '@/components/site/CartProvider';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';
import { navLinks } from '@/src/data/mockData';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { customer, isAuthenticated, openAuthDialog, logout, authBusy } = useFirebaseCustomerAuth();
  const itemCount = cart?.totalQuantity ?? 0;

  const avatarSrc = customer?.id ? `/api/customer/avatar?t=${encodeURIComponent(customer.id)}` : null;

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [customer?.id]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const desktopMenu = desktopProfileMenuRef.current;
      const mobileMenu = mobileProfileMenuRef.current;

      if (!desktopMenu && !mobileMenu) {
        return;
      }

      const target = event.target as Node;

      if ((desktopMenu && desktopMenu.contains(target)) || (mobileMenu && mobileMenu.contains(target))) {
        return;
      }

      setProfileMenuOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <nav className="glass-nav fixed top-0 z-50 w-full border-b border-outline-variant/30 shadow-[0_10px_30px_-24px_rgba(26,28,26,0.75)]">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3 md:gap-5 md:px-8 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-80 sm:gap-4">
          <Image 
            src="/logo.png" 
            alt="Veritraa Enterprises" 
            height={144} 
            width={144}
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
            priority
          />
          <div className="hidden min-w-[6rem] sm:flex items-center leading-none">
            <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.28em] text-primary/90 md:text-[11px]">
              PURE.TRUE.TRUSTED
            </span>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 md:flex">
          <div className="flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  className={`border-b-2 pb-1.5 font-body text-sm font-medium tracking-tight transition-all duration-300 ease-out ${
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
        </div>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <Link
            aria-label="Shopping bag"
            className="relative inline-flex h-10 w-10 items-center justify-center cursor-pointer text-on-background transition-all hover:bg-white/70 hover:text-primary"
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
            <div className="relative" ref={desktopProfileMenuRef}>
              <button
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                aria-label={`Profile menu for ${customer.name}`}
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#d7bea8] bg-white/95 p-0.5 shadow-[0_10px_22px_-14px_rgba(26,28,26,0.45)] transition hover:scale-[1.02] hover:border-[#cfa07f]"
                onClick={() => setProfileMenuOpen((value) => !value)}
                type="button"
              >
                {avatarSrc && !avatarLoadFailed ? (
                  <img alt={customer.name} className="h-full w-full rounded-full object-cover" onError={() => setAvatarLoadFailed(true)} src={avatarSrc} />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-[#f7eadf] text-[#8a3a17]">
                    <UserCircle2 size={22} />
                  </span>
                )}
              </button>

              {profileMenuOpen ? (
                <div
                  aria-label="Profile actions"
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-52 rounded-[1.35rem] border border-[#e2c7b1] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(248,239,230,0.98))] p-3 shadow-[0_24px_55px_-30px_rgba(26,28,26,0.55)] backdrop-blur-md"
                  role="menu"
                >
                  <div className="rounded-2xl border border-[#edd8c8] bg-white/70 px-3 py-2.5 text-center">
                    <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a55d37]">
                      Signed in as
                    </div>
                    <div className="mt-1 whitespace-nowrap text-[14px] font-semibold leading-none text-[#4b2616]">
                      {customer.name}
                    </div>
                  </div>
                  <button
                    className="mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[#d9c1ad] bg-[#8a3a17] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_-14px_rgba(138,58,23,0.8)] transition hover:bg-[#6f2507] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={authBusy}
                    onClick={() => {
                      setProfileMenuOpen(false);
                      void logout();
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button
              className="spice-gradient rounded-full px-4 py-2 text-xs font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 sm:px-5 md:text-sm"
              onClick={() => {
                setProfileMenuOpen(false);
                openAuthDialog();
              }}
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
          <div className="flex flex-col gap-3">
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
            <div className="flex items-center gap-3 pt-1">
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
                <div className="relative ml-auto" ref={mobileProfileMenuRef}>
                  <button
                    aria-expanded={profileMenuOpen}
                    aria-haspopup="menu"
                    aria-label={`Profile menu for ${customer.name}`}
                    className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#d7bea8] bg-white/95 p-0.5 shadow-[0_10px_22px_-14px_rgba(26,28,26,0.45)]"
                    onClick={() => setProfileMenuOpen((value) => !value)}
                    type="button"
                  >
                    {avatarSrc && !avatarLoadFailed ? (
                      <img alt={customer.name} className="h-full w-full rounded-full object-cover" onError={() => setAvatarLoadFailed(true)} src={avatarSrc} />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#f7eadf] text-[#8a3a17]">
                        <UserCircle2 size={20} />
                      </span>
                    )}
                  </button>

                  {profileMenuOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-52 rounded-[1.35rem] border border-[#e2c7b1] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(248,239,230,0.98))] p-3 shadow-[0_24px_55px_-30px_rgba(26,28,26,0.55)] backdrop-blur-md">
                      <div className="rounded-2xl border border-[#edd8c8] bg-white/70 px-3 py-2.5 text-center">
                        <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a55d37]">
                          Signed in as
                        </div>
                        <div className="mt-1 whitespace-nowrap text-[14px] font-semibold leading-none text-[#4b2616]">
                          {customer.name}
                        </div>
                      </div>
                      <button
                        className="mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl border border-[#d9c1ad] bg-[#8a3a17] px-3 py-2.5 text-sm font-semibold text-white shadow-[0_12px_22px_-14px_rgba(138,58,23,0.8)] transition hover:bg-[#6f2507] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={authBusy}
                        onClick={() => {
                          setProfileMenuOpen(false);
                          void logout();
                        }}
                        type="button"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <button
                  className="spice-gradient rounded-full px-4 py-2 text-xs font-medium text-on-primary"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    openAuthDialog();
                  }}
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
