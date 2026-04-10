import Link from 'next/link';
import { Globe, Mail, Phone } from 'lucide-react';

interface SiteFooterProps {}

export default function SiteFooter(_: Readonly<SiteFooterProps>) {
  return (
    <footer className="w-full border-t border-[#d4a900]/40 bg-[#5f0808]/95 px-6 py-6 text-[#d9b43a] md:px-8 md:py-7">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] md:items-start">
          <div className="text-center md:text-left">
            <h2 className="font-headline text-xl uppercase tracking-[0.16em] md:text-2xl">
              Veritraa Enterprises
            </h2>
            <div className="mx-auto mt-2 h-0.5 w-14 bg-[#d4a900] md:mx-0" />
            <p className="mt-3 font-headline text-xl italic text-[#fff7de] md:text-2xl">
              Pure. True. Trusted.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-[#fff7de] md:min-w-[360px] md:text-base">
            <div className="border border-[#d4a900] px-3 py-2 text-center">FSSAI License No. 21526086000916</div>
            <div className="border border-[#d4a900] px-3 py-2 text-center">UDYAM UDYAM-MH-15-0288846</div>
            <div className="border border-[#d4a900] px-3 py-2 text-center">Shop Act 2631200321013539</div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#d4a900]/30 pt-4 text-center">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-sm text-[#fff7de] md:flex-row md:justify-center md:gap-6 md:text-lg">
            <a className="inline-flex items-center justify-center gap-2 hover:text-white" href="https://veritraa.in">
              <Globe size={15} />
              Veritraa.in
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 hover:text-white"
              href="mailto:veritraa.si@gmail.com"
            >
              <Mail size={15} />
              veritraa.si@gmail.com
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 hover:text-white"
              href="tel:+918983002683"
            >
              <Phone size={15} />
              +91 8983002683
            </a>
          </div>

          <div className="mt-4 text-xs text-[#d9b43a] md:text-sm">
            <p className="font-semibold">&#169; 2026 Veritraa Enterprises. All Rights Reserved.</p>
            <p className="mt-1.5 font-semibold uppercase tracking-[0.14em] text-[#c9a12f]">
              Women-Led | Clean Label | Farm to Pack
            </p>
          </div>

          <div className="mt-2.5 flex justify-center gap-5 text-[11px] text-[#d9b43a] md:text-xs">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

