'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import { navLinks } from '@/src/data/mockData';

interface NavbarProps {}

export default function Navbar(_: Readonly<NavbarProps>) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-nav fixed top-0 z-50 w-full border-b border-outline-variant/30 shadow-[0_10px_30px_-24px_rgba(26,28,26,0.75)]">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-3 md:gap-4 md:px-8 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3">
          <Image 
            src="/logo.png" 
            alt="Veritraa Enterprises" 
            height={96} 
            width={96}
            className="h-11 w-11 rounded-full object-cover shadow-sm sm:h-13 sm:w-13 md:h-14 md:w-14"
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
          <button
            aria-label="Shopping bag"
            className="relative cursor-pointer text-on-background transition-all hover:text-primary hover:scale-110"
            type="button"
          >
            <ShoppingBag size={20} />
            <span className="absolute -right-2 -top-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-md">
              2
            </span>
          </button>
          <button className="spice-gradient rounded-full px-6 py-2.5 text-xs md:text-sm font-semibold text-on-primary shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105">
            Login
          </button>
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
              <button
                aria-label="Shopping bag"
                className="relative text-on-background"
                type="button"
              >
                <ShoppingBag size={18} />
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  2
                </span>
              </button>
              <button className="spice-gradient rounded-full px-4 py-2 text-xs font-medium text-on-primary">
                Login with Shopify
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
