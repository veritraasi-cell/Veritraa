'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { veritraaShowcaseSlides } from '@/components/site/veritraaShowcaseSlides';

type HeroSlide = {
  type: 'hero';
};

const slides: ReadonlyArray<HeroSlide | (typeof veritraaShowcaseSlides)[number]> = [
  {
    type: 'hero' as const,
  },
  ...veritraaShowcaseSlides,
] as const;

export default function MobileHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
      <section className="mx-2 mt-4 overflow-hidden rounded-3xl sm:mx-4 md:hidden">
        <div className="relative h-[78vh] min-h-[560px] max-h-[860px] overflow-hidden rounded-3xl bg-transparent md:bg-[#f2e2c4] shadow-[0_24px_70px_-40px_rgba(44,22,10,0.55)]">
        {slides.map((slide, index) => (
          <div
            key={'type' in slide ? 'hero-slide' : slide.src}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === activeSlide
                ? 'translate-x-0 opacity-100'
                : index < activeSlide
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
            }`}
          >
            {'type' in slide ? (
              <>
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbYIa1YqPkAdvxpJljEpT6qO4A5dR4ceCvHAkLT3AuTzpMSk_PqAn4NaIf9Zm6zEMNFiukI_DyntN93ZmHBUQyWzjP8KyKrPOq4Hrk2GNgVxf3nTNFIHr3435khSXtkF88a0WN5DJ75YQtlKRiCDYjR3Tok5-2_roRwTq6MP0YjkOhUmDsiqz48Zl4Vhcchj_9AXDyc-ZVKni7uLdYHBNshLo-pScZtHE74OMyPjF46fMupEzx6oYWCbzLdEPGqb5ti6Yt5MGBHWXY"
                  alt="Veritraa hero banner"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(23,53,9,0.42)_0%,rgba(23,53,9,0)_45%,rgba(23,53,9,0)_65%,rgba(23,53,9,0.58)_100%)]" />
                <Link href="/" className="absolute left-4 top-4 z-20">
                  <Image
                    alt="Veritraa logo"
                    src="/logo.jpeg"
                    width={96}
                    height={96}
                    priority={index === 0}
                    className="h-20 w-20 rounded-full object-cover shadow-[0_18px_38px_-22px_rgba(0,0,0,0.6)]"
                  />
                </Link>
                <div className="absolute inset-x-0 top-28 z-10 flex flex-col items-center text-center">
                  <h1 className="max-w-[11ch] font-headline text-4xl leading-[1.1] text-white drop-shadow-2xl">
                    The World&apos;s Finest Spices &amp; Dry Fruits
                  </h1>
                </div>
              </>
            ) : (
              <>
                <Image
                  src={encodeURI(slide.src)}
                  alt={slide.alt}
                  fill
                  priority={index === 1}
                  sizes="100vw"
                  className={`object-cover ${slide.mobilePosition}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#28130b]/28 via-transparent to-transparent" />
              </>
            )}
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={'type' in slide ? 'hero-dot' : slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/55'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
