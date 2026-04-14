'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { veritraaShowcaseSlides } from '@/components/site/veritraaShowcaseSlides';

export default function CloserLookCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = veritraaShowcaseSlides[activeSlide];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % veritraaShowcaseSlides.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] lg:items-start">
      <div className="overflow-hidden rounded-[1.75rem] border border-[#dcc4b0]/70 bg-[#f8f1e7] p-3 shadow-[0_26px_60px_-40px_rgba(80,28,10,0.8)] sm:p-4">
        <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-white/45 bg-[radial-gradient(circle_at_top,rgba(255,248,240,0.95),rgba(233,213,191,0.92))]">
          {veritraaShowcaseSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className={`object-contain p-2 transition-transform duration-[1400ms] sm:p-4 ${
                  index === activeSlide ? 'scale-100' : 'scale-[1.03]'
                }`}
              />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[1.25rem] border border-[#e2cdb9] bg-white/72 p-5 shadow-[0_18px_30px_-28px_rgba(70,28,12,0.8)] sm:p-6">
          <h3 className="max-w-2xl font-headline text-2xl leading-tight text-[#4f1d0c] sm:text-3xl">
            {currentSlide.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#7b5647] sm:text-base">
            {currentSlide.copy}
          </p>
        </div>
      </div>

      <div className="hidden grid-cols-2 gap-3 lg:grid">
        {veritraaShowcaseSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`group overflow-hidden rounded-[1.35rem] border p-2 text-left transition-all duration-300 ${
              index === activeSlide
                ? 'border-[#a04100]/35 bg-white shadow-[0_18px_30px_-24px_rgba(92,31,16,0.9)]'
                : 'border-[#dcc4b0]/70 bg-white/70 hover:border-[#a04100]/20'
            }`}
          >
            <div className="relative aspect-square overflow-hidden rounded-[1rem] border border-white/40 bg-[radial-gradient(circle_at_top,rgba(255,248,240,0.95),rgba(233,213,191,0.92))]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 18vw, 100vw"
                className={`object-contain p-2 transition-transform duration-500 ${
                  index === activeSlide ? 'scale-100' : 'group-hover:scale-105'
                }`}
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f2f12]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="px-1 pb-1 pt-3">
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#4f1d0c]">{slide.title}</p>
              <p className="mt-1 hidden text-xs leading-5 text-[#7f5a4a] xl:block">{slide.copy}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2 lg:hidden">
        {veritraaShowcaseSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'w-8 bg-[#a04100]' : 'w-2.5 bg-[#d6a887]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
