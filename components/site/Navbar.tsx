'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { House, LogOut, Menu, ShoppingBag, Store, UserCircle2, X } from 'lucide-react';
import { useCart } from '@/components/site/CartProvider';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';
import { navLinks } from '@/src/data/mockData';
import styles from './NavbarMobile.module.css';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [failedAvatarCustomerId, setFailedAvatarCustomerId] = useState<string | null>(null);
  const desktopProfileMenuRef = useRef<HTMLDivElement>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { customer, isAuthenticated, openAuthDialog, logout, authBusy } = useFirebaseCustomerAuth();
  const itemCount = cart?.totalQuantity ?? 0;

  const avatarSrc =
    customer?.id && failedAvatarCustomerId !== customer.id
      ? `/api/customer/avatar?t=${encodeURIComponent(customer.id)}`
      : null;
  const customerFirstName = customer?.name?.trim().split(/\s+/)[0] ?? 'Guest';

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

  function isLinkActive(href: string) {
    return href === '/' ? pathname === href : pathname.startsWith(href);
  }

  function handleOpenAuthDialog() {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    openAuthDialog();
  }

  function handleOpenMobileAccount() {
    if (!isAuthenticated || !customer) {
      handleOpenAuthDialog();
      return;
    }

    setMobileMenuOpen(false);
    setProfileMenuOpen(true);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 select-none px-3 pt-3 md:border-b md:border-outline-variant/30 md:bg-[rgba(255,251,247,0.96)] md:px-0 md:pt-0 md:shadow-[0_10px_30px_-24px_rgba(26,28,26,0.26)] md:[backdrop-filter:blur(14px)]">
      <div className="mx-auto max-w-screen-2xl">
        <div className={cx('relative md:rounded-none md:border-none md:bg-transparent md:shadow-none md:backdrop-blur-none', styles.mobileShell)}>
          <div className={cx('pointer-events-none absolute inset-0 md:hidden', styles.mobileShellGlow)} />

          <div className="relative mx-auto grid h-[82px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-[88px] sm:px-5 md:grid-cols-[auto_1fr_auto] md:gap-6 md:px-8 md:h-[92px]">
            <Link
              href="/"
              className="flex min-w-0 shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
              onClick={() => {
                setMobileMenuOpen(false);
                setProfileMenuOpen(false);
              }}
            >
              <span className={cx('flex shrink-0 items-center justify-center', styles.mobileBrandBadge)}>
                <Image
                  src="/logo.png"
                  alt="Veritraa Enterprises"
                  height={144}
                  width={144}
                  className="h-10 w-10 shrink-0 object-contain drop-shadow-[0_10px_18px_rgba(53,32,11,0.28)] sm:h-11 sm:w-11 md:h-16 md:w-16 md:drop-shadow-none"
                  priority
                />
              </span>
              <div className="min-w-0">
                <p className={cx('font-headline text-[1.1rem] leading-none text-[#4b2616] sm:text-[1.2rem] md:text-2xl', styles.mobileBrandTitle)}>
                  Veritraa
                </p>
                <p className="mt-1 hidden whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.28em] text-primary/90 md:block">
                  Pure. True. Trusted.
                </p>
              </div>
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
              <div className="flex items-center gap-8 xl:gap-10">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href);

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

            <div className="hidden shrink-0 items-center justify-end gap-3 md:flex">
              <Link
                aria-label="Shopping bag"
                className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e2c8b4]/80 bg-white/75 text-on-background shadow-[0_14px_28px_-20px_rgba(90,46,19,0.4)] transition-all hover:bg-white hover:text-primary"
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
                    {avatarSrc ? (
                      <Image
                        alt={customer.name}
                        className="h-full w-full rounded-full object-cover"
                        height={44}
                        onError={() => setFailedAvatarCustomerId(customer.id)}
                        src={avatarSrc}
                        unoptimized
                        width={44}
                      />
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
                          Your account
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
                  className="spice-gradient rounded-full px-5 py-2.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40"
                  onClick={handleOpenAuthDialog}
                  type="button"
                >
                  Sign in
                </button>
              )}
            </div>

            <div className="relative flex items-center justify-end gap-2 md:hidden" ref={mobileProfileMenuRef}>
              {isAuthenticated && customer ? (
                <button
                  aria-expanded={profileMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`Profile menu for ${customer.name}`}
                  className={cx(styles.mobileActionButton, profileMenuOpen && styles.mobileActionButtonActive, 'p-0.5')}
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  type="button"
                >
                  {avatarSrc ? (
                    <Image
                      alt={customer.name}
                      className="h-full w-full rounded-[14px] object-cover"
                      height={44}
                      onError={() => setFailedAvatarCustomerId(customer.id)}
                      src={avatarSrc}
                      unoptimized
                      width={44}
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#f7eadf] text-[#8a3a17]">
                      <UserCircle2 size={20} />
                    </span>
                  )}
                </button>
              ) : (
                <button
                  aria-label="Open sign in"
                  className={cx(styles.mobileActionButton, styles.mobileActionButtonActive)}
                  onClick={handleOpenAuthDialog}
                  type="button"
                >
                  <UserCircle2 size={20} />
                </button>
              )}

              <Link
                aria-label="Shopping bag"
                className={cx(styles.mobileActionButton, isLinkActive('/cart') && styles.mobileActionButtonActive)}
                href="/cart"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileMenuOpen(false);
                }}
              >
                <ShoppingBag size={18} />
                {itemCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-md">
                    {itemCount}
                  </span>
                ) : null}
              </Link>

              <button
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation"
                className={cx(styles.mobileActionButton, mobileMenuOpen && styles.mobileActionButtonActive)}
                onClick={() => {
                  setProfileMenuOpen(false);
                  setMobileMenuOpen((value) => !value);
                }}
                type="button"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>

              {profileMenuOpen && isAuthenticated && customer ? (
                <div aria-label="Profile actions" className={styles.mobileProfilePanel} role="menu">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.05] px-3 py-3 text-center">
                    <div className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f2c18a]">
                      Your account
                    </div>
                    <div className="mt-1 whitespace-nowrap text-sm font-semibold leading-none text-[#fff8ef]">
                      {customer.name}
                    </div>
                  </div>
                  <button
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-[1.15rem] border border-[#f0ba73]/60 bg-[linear-gradient(180deg,rgba(255,214,151,0.96),rgba(244,171,84,0.92))] px-3 py-2.5 text-sm font-semibold text-[#221006] shadow-[0_14px_28px_-20px_rgba(240,186,115,0.9)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={authBusy}
                    onClick={() => {
                      setMobileMenuOpen(false);
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
          </div>

          {mobileMenuOpen ? (
            <div className="px-3 pb-3 md:hidden">
              <div className={cx('animate-fadeInUp', styles.mobileMenuPanel)}>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = isLinkActive(link.href);
                    const DockIcon = link.href === '/' ? House : Store;
                    const eyebrow = link.href === '/' ? 'Start' : 'Browse';
                    const detail = link.href === '/' ? 'Home base' : 'Spice store';

                    return (
                      <Link
                        key={link.label}
                        className={cx(styles.mobileTile, isActive ? styles.mobileTileActive : styles.mobileTileIdle)}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={cx(styles.mobileTileIcon, isActive ? styles.mobileTileIconActive : styles.mobileTileIconIdle)}>
                          <DockIcon size={19} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f1c18b]/70">
                            {eyebrow}
                          </span>
                          <span className="mt-1 block text-base font-semibold text-[#fff8ef]">{link.label}</span>
                          <span className="mt-1 block text-[12px] text-[#f1d4b2]/75">{detail}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {isAuthenticated && customer ? (
                  <button
                    className={cx(styles.mobileTile, profileMenuOpen ? styles.mobileTileActive : styles.mobileTileIdle, 'mt-2')}
                    onClick={handleOpenMobileAccount}
                    type="button"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className={cx(styles.mobileTileIcon, profileMenuOpen ? styles.mobileTileIconActive : styles.mobileTileIconIdle)}>
                        <UserCircle2 size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f1c18b]/70">
                          Account
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#fff8ef]">Profile</span>
                        <span className="mt-1 block truncate text-[12px] text-[#f1d4b2]/75">{customerFirstName}</span>
                      </span>
                    </span>
                  </button>
                ) : (
                  <button
                    className={cx(styles.mobileTile, styles.mobileTileIdle, 'mt-2')}
                    onClick={handleOpenAuthDialog}
                    type="button"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className={cx(styles.mobileTileIcon, styles.mobileTileIconActive)}>
                        <UserCircle2 size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-[#f1c18b]/70">
                          Login
                        </span>
                        <span className="mt-1 block text-base font-semibold text-[#fff8ef]">Sign in</span>
                        <span className="mt-1 block text-[12px] text-[#f1d4b2]/75">Open account</span>
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
