'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  {
    src: '/hero-mobile-1.jpeg',
    alt: 'Veritraa spice story slide 1',
    mobilePosition: 'object-center',
  },
  {
    src: '/hero-mobile-2.jpeg',
    alt: 'Veritraa spice story slide 2',
    mobilePosition: 'object-center',
  },
  {
    src: '/hero-mobile-3.jpeg',
    alt: 'Veritraa spice story slide 3',
    mobilePosition: 'object-center',
  },
  {
    src: '/hero-mobile-4.jpeg',
    alt: 'Veritraa spice story slide 4',
    mobilePosition: 'object-center',
  },
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
    <section className="mx-2 mt-3 overflow-hidden rounded-3xl sm:mx-4 md:mx-6">
      <div className="relative md:hidden">
        <div className="relative h-[78vh] min-h-[560px] max-h-[860px] overflow-hidden rounded-3xl bg-[#f2e2c4] shadow-[0_24px_70px_-40px_rgba(44,22,10,0.55)]">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                index === activeSlide
                  ? 'translate-x-0 opacity-100'
                  : index < activeSlide
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              }`}
            >
              <Image
                src={encodeURI(slide.src)}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover ${slide.mobilePosition}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#28130b]/28 via-transparent to-transparent" />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
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
      </div>

      <div className="hidden md:block">
        <div className="relative min-h-[calc(100vh-5.5rem)] overflow-hidden rounded-3xl bg-[#f2e2c4] shadow-[0_24px_70px_-40px_rgba(44,22,10,0.55)]">
          <Image
            src={slides[0].src}
            alt="Veritraa hero banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#28130b]/20 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
