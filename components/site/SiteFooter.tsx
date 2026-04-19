import Link from 'next/link';
import { Globe, Mail, Phone } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-[#d4a900]/40 bg-[#5f0808]/95 px-4 py-4 text-[#d9b43a] sm:px-5 sm:py-5 md:px-8 md:py-7">
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-start md:gap-5">
          <div className="text-center md:text-left">
            <h2 className="font-headline text-base uppercase tracking-[0.12em] sm:text-lg md:text-2xl">
              Veritraa Enterprises
            </h2>
            <div className="mx-auto mt-1.5 h-0.5 w-10 bg-[#d4a900] md:mx-0 md:mt-2 md:w-14" />
            <p className="mt-2 font-headline text-sm italic text-[#fff7de] sm:text-base md:mt-3 md:text-2xl">
              Pure. True. Trusted.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px] text-[#fff7de] sm:text-xs md:min-w-[360px] md:gap-2 md:text-base">
            <div className="border border-[#d4a900] px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
              FSSAI License No. 21526086000916
            </div>
            <div className="border border-[#d4a900] px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
              UDYAM UDYAM-MH-15-0288846
            </div>
            <div className="border border-[#d4a900] px-2.5 py-1.5 text-center sm:px-3 sm:py-2">
              Shop Act 2631200321013539
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-[#d4a900]/30 pt-3 text-center md:mt-6 md:pt-4">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-1.5 text-xs text-[#fff7de] sm:text-sm md:flex-row md:justify-center md:gap-6 md:text-lg">
            <a className="inline-flex items-center justify-center gap-2 hover:text-white" href="https://veritraa.in">
              <Globe size={13} />
              Veritraa.in
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 hover:text-white"
              href="mailto:veritraa.si@gmail.com"
            >
              <Mail size={13} />
              veritraa.si@gmail.com
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 hover:text-white"
              href="tel:+918983002683"
            >
              <Phone size={13} />
              +91 8983002683
            </a>
          </div>

          <div className="mt-3 text-[11px] text-[#d9b43a] md:mt-4 md:text-sm">
            <p className="font-semibold">&#169; 2026 Veritraa Enterprises. All Rights Reserved.</p>
            <p className="mt-1 font-semibold uppercase tracking-[0.12em] text-[#c9a12f] sm:tracking-[0.14em]">
              Women-Led | Clean Label | Farm to Pack
            </p>
          </div>

          <div className="mt-2 flex justify-center gap-4 text-[10px] text-[#d9b43a] md:mt-2.5 md:gap-5 md:text-xs">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>

          <div className="mt-3 text-[11px] text-[#d9b43a] md:mt-4 md:text-sm">
            <p className="text-sm text-[#fff7de]">
              Crafted by{' '}
              <a
                href="https://www.linkedin.com/in/nishant-chaubey-9b3080313?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Nishant Chaubey
              </a>{' '}
              and{' '}
              <a
                href="https://www.linkedin.com/in/yash-kumar-tripathi-998457306?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Yash Tripathi
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

