'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Users,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
] as const;

function isActivePath(currentPath: string, targetPath: string) {
  if (targetPath === '/admin') {
    return currentPath === '/admin';
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}

export default function AdminShell({
  children,
  currentPath,
  adminName,
  adminRole,
  notificationsCount = 0,
}: Readonly<{
  children: React.ReactNode;
  currentPath: string;
  adminName: string;
  adminRole: string;
  notificationsCount?: number;
}>) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = useMemo(
    () => NAV_ITEMS.find((item) => isActivePath(currentPath, item.href)) ?? NAV_ITEMS[0],
    [currentPath]
  );

  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    router.replace('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fcf4e8,#f7e9d6)] text-[#4b1f0f]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[18rem_minmax(0,1fr)]">
        <button
          type="button"
          aria-label="Close sidebar"
          className={`fixed inset-0 z-30 bg-black/30 transition lg:hidden ${mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#e3c7ab] bg-[#fffaf4]/96 p-5 shadow-[0_24px_54px_-40px_rgba(63,28,16,0.55)] backdrop-blur transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a04a1d]">Veritraa Admin</p>
              <h1 className="mt-1 font-headline text-2xl leading-tight text-[#4b1f0f]">Operations Center</h1>
              <p className="mt-1 text-xs text-[#7f5a4a]">{adminName}</p>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              className="rounded-full border border-[#e6cdb3] bg-white p-2 text-[#7f5a4a] lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(currentPath, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                    active
                      ? 'border-[#d8a36f] bg-[#f8ebdf] text-[#8a3a17]'
                      : 'border-transparent bg-transparent text-[#5c3d31] hover:border-[#e6cdb3] hover:bg-white'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </span>
                  <ChevronRight size={14} className={active ? 'text-[#8a3a17]' : 'text-[#c69a78]'} />
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl border border-[#ead7c4] bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a04a1d]">Current section</p>
            <p className="mt-1 text-sm font-semibold text-[#4b1f0f]">{activeItem.label}</p>
            <p className="mt-1 text-xs leading-5 text-[#7f5a4a]">Use the sidebar to move between store operations without losing context.</p>
          </div>

          <Link
            href="/"
            className="mt-4 inline-flex items-center justify-center rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
          >
            View storefront
          </Link>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-[#e3c7ab] bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  className="rounded-2xl border border-[#e6cdb3] bg-white p-2 text-[#7f5a4a] lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a04a1d]">{activeItem.label}</p>
                  <h2 className="font-headline text-xl leading-tight text-[#4b1f0f] sm:text-2xl">{adminName}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={`Notifications (${notificationsCount})`}
                  className="relative rounded-2xl border border-[#e6cdb3] bg-white p-2.5 text-[#6f4b3f]"
                >
                  <Bell size={18} />
                  {notificationsCount > 0 ? (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#8a3a17] px-1 text-[10px] font-semibold text-white">
                      {notificationsCount}
                    </span>
                  ) : null}
                </button>
                <div className="hidden items-end gap-2 sm:flex">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#4b1f0f]">{adminRole}</p>
                    <p className="text-xs text-[#7f5a4a]">{adminName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void handleLogout();
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#8a3a17] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
