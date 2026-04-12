'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Sparkles, Star } from 'lucide-react';
import ProductCard from '@/components/site/ProductCard';
import {
  homeBenefits,
  homeCollections,
  testimonials,
  shopProducts,
} from '@/src/data/mockData';

export default function HomePage() {
  const bestSellerNames = [
    'Shahi Garam Masala',
    'Kanda Lasun Chutney',
    'Kala Masala',
    'Shahi Biryani Masala',
    'Shahi Paneer Masala',
  ];

  const bestSellerProducts = shopProducts.filter((product) =>
    bestSellerNames.includes(product.name)
  );

  return (
    <>
      <section className="story-surface relative mx-2 mt-3 flex min-h-[50vh] w-auto items-center justify-center overflow-hidden rounded-3xl sm:mx-4 sm:min-h-[65vh] md:mx-6 md:min-h-[calc(100vh-5.5rem)]">
        <Image
          src="/veritraaimg_page-0001.jpg"
          alt=""
          fill
          aria-hidden="true"
          sizes="100vw"
          className="object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-[#f6efe4]/35" />
        <Image
          src="/veritraaimg_page-0001.jpg"
          alt="Veritraa hero banner"
          width={2231}
          height={1775}
          priority
          sizes="100vw"
          className="relative z-10 h-auto w-auto max-w-full max-h-[50vh] sm:max-h-[65vh] md:max-h-[calc(100vh-5.5rem)]"
        />
      </section>

      <section className="story-surface mx-auto mt-5 max-w-screen-2xl rounded-3xl px-4 py-14 sm:px-6 sm:py-16 md:mt-6 md:px-8 md:py-24" id="collections">
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="font-headline text-2xl text-on-background sm:text-3xl md:text-4xl">Shop Our Signature Range</h2>
          <p className="mt-3 hidden text-sm text-on-surface-variant sm:block sm:text-base">Handpicked masalas and spice blends curated for modern kitchens</p>
          <div className="mt-2 space-y-0.5 sm:hidden">
            <p className="mobile-single-line text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              Jeera | Haldi | Dhaniya | Garam
            </p>
            <p className="mobile-single-line text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              Purity | Aroma | Handpicked
            </p>
          </div>
          <div className="mt-4 h-1 w-24 rounded-full bg-primary" />
        </div>

        <div className="no-scrollbar grid grid-flow-col auto-cols-[46%] gap-3 overflow-x-auto pb-1 sm:grid-cols-3 sm:auto-cols-auto sm:overflow-visible sm:pb-0 sm:gap-5 lg:grid-cols-4">
          {shopProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.name} product={product} variant="preview" />
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:mt-10 md:mt-12">
          <Link
            href="/shop"
            className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-on-primary shadow-xl shadow-primary/20 transition-transform hover:scale-105 sm:px-8 sm:py-4 sm:text-base"
          >
            Explore Full Collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-20">
        <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
          <Link
            href="/shop"
            className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white shadow-2xl shadow-[#ff9762]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#ff9762]/50 md:px-12 md:py-5 md:text-base"
          >
            Shop Now
            <ArrowRight size={20} />
          </Link>
          <Link
            href="#brand-promise"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#8b1d1d] bg-[#8b1d1d]/10 px-8 py-3 text-sm font-bold text-[#8b1d1d] transition-all duration-300 hover:bg-[#8b1d1d]/20 md:px-12 md:py-5 md:text-base"
          >
            Our Story
            <Sparkles size={20} />
          </Link>
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl px-4 py-10 sm:mx-4 sm:px-6 sm:py-14 md:mx-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-8 xl:gap-12">
          {homeBenefits.map((benefit) => {
            const accentClass =
              benefit.accent === 'secondary'
                ? 'bg-secondary-container text-on-secondary-container'
                : benefit.accent === 'primary'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-tertiary-container text-on-tertiary-container';

            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/65 px-2 py-4 text-center shadow-sm sm:gap-3 sm:rounded-3xl sm:px-6 sm:py-8"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm sm:h-16 sm:w-16 ${accentClass}`}>
                  <span className="material-symbols-outlined text-xl sm:text-3xl">{benefit.icon}</span>
                </div>
                <h4 className="font-headline text-sm sm:text-xl">{benefit.title}</h4>
                <p className="hidden max-w-xs text-sm leading-6 text-on-surface-variant sm:block">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mobile Story / Vision / Mission Slider */}
      <section className="story-surface mx-2 rounded-3xl px-4 py-8 md:hidden" id="brand-promise">
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a04100]">Veritraa Core</p>
          <h2 className="mt-2 font-serif text-3xl text-[#8b1d1d]">Our Story</h2>
          <p className="mt-2 text-sm text-[#6f4b3f]">Swipe cards to view our story, vision, and mission.</p>
        </div>

        <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
          <article className="min-w-[88%] snap-center rounded-2xl border border-[#b66e37]/40 bg-gradient-to-br from-[#2f0f05] via-[#64250d] to-[#a04100] p-5 text-[#fff4e8] shadow-[0_18px_40px_-24px_rgba(82,28,4,0.9)]">
            <p className="inline-flex rounded-full bg-[#ffd5ac]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffd8b2]">Our Story</p>
            <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">Purity in every blend</h3>
            <p className="mt-3 text-sm leading-6 text-[#ffe8d5]">
              At Veritraa, we believe the soul of Indian cooking lies in pure spices. We source directly from farmers
              and pack hygienically without additives or fillers.
            </p>
          </article>

          <article className="min-w-[88%] snap-center rounded-2xl border border-[#8b1d1d]/45 bg-gradient-to-br from-[#1d1129] via-[#4b1539] to-[#8b1d1d] p-5 text-[#fbe7ef] shadow-[0_18px_40px_-24px_rgba(58,12,30,0.95)]">
            <p className="inline-flex rounded-full bg-[#f8c5d9]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ffd5e4]">Vision</p>
            <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">Authentic origins, global trust</h3>
            <p className="mt-3 text-sm leading-6 text-[#ffe6f0]">
              To build a globally respected Indian brand rooted in authentic origins and defined by uncompromised
              purity.
            </p>
          </article>

          <article className="min-w-[88%] snap-center rounded-2xl border border-[#0f6f65]/45 bg-gradient-to-br from-[#042725] via-[#0f3e3b] to-[#136f63] p-5 text-[#e4fffa] shadow-[0_18px_40px_-24px_rgba(4,42,39,0.95)]">
            <p className="inline-flex rounded-full bg-[#b8fff3]/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4fff8]">Mission</p>
            <h3 className="mt-3 font-serif text-2xl font-bold leading-tight text-white">Clean-label for modern kitchens</h3>
            <p className="mt-3 text-sm leading-6 text-[#dbfff7]">
              To source, craft, and deliver traceable spices that meet modern quality standards while building
              women-led supply chains.
            </p>
          </article>
        </div>
      </section>

      {/* Our Story Section - New Design */}
      <section className="story-surface relative mx-2 hidden items-center overflow-hidden rounded-3xl px-4 pb-16 pt-10 sm:mx-4 sm:px-6 md:mx-6 md:flex md:min-h-screen md:px-12 md:pb-24 md:pt-12">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 sm:gap-10 md:grid-cols-12 md:gap-12">
          {/* Left: Content */}
          <div className="z-10 space-y-6 md:col-span-5 md:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#a04100] sm:text-sm">Our Heritage</p>
              <h1 className="font-serif text-4xl font-bold leading-[0.9] tracking-tight text-[#8b1d1d] sm:text-5xl md:text-7xl lg:text-8xl">Our Story</h1>
            </div>
            <div className="max-w-md space-y-4 sm:space-y-5 md:space-y-6">
              <p className="text-base font-medium leading-relaxed text-[#8b1d1d] sm:text-lg md:text-xl">
                At Veritraa, we believe the soul of Indian cooking lies in the purity of its spices.
              </p>
              <p className="text-sm font-light leading-relaxed text-on-surface-variant sm:text-base">
                Every product in our catalogue is sourced directly from farmers, lab-tested for quality, and packed under hygienic conditions with no additives, no fillers, no compromise.
              </p>
              <div className="pt-2 sm:pt-4">
                <Link href="/shop" className="inline-block rounded-lg bg-gradient-to-r from-[#a04100] to-[#ff9762] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-8 sm:py-4 sm:text-sm">
                  Explore The Process
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Asymmetric Image Layout */}
          <div className="relative h-[300px] min-[420px]:h-[360px] md:col-span-7 md:h-[600px]">
            <div className="relative z-10 h-64 w-full overflow-hidden rounded-lg border-4 border-[#E8A800]/30 shadow-2xl min-[420px]:h-72 md:h-96">
              <img alt="Artisan Spice Selection" className="w-full h-full object-cover" src="/masalas/1.Turmeric_Powder.png" />
            </div>
            {/* Overlapping element */}
            <div className="hidden md:block absolute bottom-0 left-0 z-20 w-64 h-80 overflow-hidden rounded-lg shadow-2xl bg-white p-2 border-2 border-[#E8A800]/20">
              <img alt="Spice Sourcing" className="w-full h-full object-cover rounded" src="/masalas/5.Shahi_Biryani_Masala.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="story-surface relative mx-2 hidden rounded-3xl px-4 py-16 sm:mx-4 sm:px-6 sm:py-20 md:mx-6 md:block md:px-12 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-24">
            {/* Vision Block */}
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-1 w-12 bg-[#E8A800]/60"></span>
                  <span className="text-xs uppercase tracking-widest text-[#a04100] font-bold">The Vision</span>
                </div>
                <h2 className="text-2xl font-serif leading-tight text-[#8b1d1d] sm:text-3xl md:text-5xl">
                  Rooted in authentic origins, defined by uncompromised purity.
                </h2>
              </div>
              <p className="border-l-4 border-[#E8A800]/40 pl-4 text-base italic leading-relaxed text-[#33261f] sm:pl-6 sm:text-lg md:text-xl">
                &ldquo;To build a globally respected Indian brand rooted in authentic origins and defined by uncompromised purity.&rdquo;
              </p>
            </div>

            {/* Mission Block */}
            <div className="space-y-8 md:mt-24 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="h-1 w-12 bg-[#ff9762]/60"></span>
                  <span className="text-xs uppercase tracking-widest text-[#a04100] font-bold">The Mission</span>
                </div>
                <h2 className="text-2xl font-serif leading-tight text-[#8b1d1d] sm:text-3xl md:text-5xl">
                  Crafting clean-label spices for the modern world.
                </h2>
              </div>
              <p className="border-l-4 border-[#ff9762]/40 pl-4 text-base italic leading-relaxed text-[#33261f] sm:pl-6 sm:text-lg md:text-xl">
                &ldquo;To source, craft, and deliver clean-label, traceable spices that meet modern quality standards while building women-led supply chains that create sustainable value.&rdquo;
              </p>
            </div>
          </div>

          {/* Centered Callout Card - Burgundy and Gold theme */}
          <div className="relative mt-14 overflow-hidden rounded-lg border-t-4 border-[#E8A800]/60 bg-gradient-to-r from-[#8b1d1d] to-[#a04100] p-6 text-white sm:mt-20 sm:p-8 md:mt-32 md:p-20">
            <div className="absolute inset-0 opacity-10 pointer-events-none" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-5 text-center sm:space-y-6 md:space-y-8">
              <Leaf className="mx-auto h-10 w-10 text-[#E8A800] sm:h-12 sm:w-12" />
              <h3 className="text-2xl font-serif text-[#E8A800] sm:text-3xl md:text-4xl">A Commitment to Heritage</h3>
              <p className="text-sm font-light leading-7 text-[#f9f3eb] sm:text-base sm:leading-8 md:text-lg md:leading-loose">
                Veritraa is more than a spice brand; it&rsquo;s a bridge between the hardworking farmers of India and your kitchen. We celebrate the alchemy of tradition and science to bring you the purest flavors.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4 sm:gap-4 sm:pt-6">
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-6 sm:text-xs">Direct From Farmers</span>
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-6 sm:text-xs">Lab Tested Purity</span>
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-6 sm:text-xs">Women-Led Supply</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl py-14 sm:mx-4 sm:py-16 md:mx-6 md:py-24" id="best-sellers">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 md:mb-12 md:flex-row md:items-end">
            <div>
              <h2 className="font-headline text-2xl text-on-background sm:text-3xl md:text-4xl">Our Best Sellers</h2>
              <p className="mt-2 text-sm text-on-surface-variant sm:text-base">
                Most-loved masalas from our signature collection.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant sm:text-sm">
              <Star size={16} className="text-primary" />
              Handpicked customer favorites
            </div>
          </div>

          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:hidden">
            {bestSellerProducts.map((product) => (
              <div key={product.name} className="min-w-[78%] snap-start">
                <ProductCard product={product} variant="preview" />
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-2 gap-3 min-[520px]:grid-cols-3 sm:grid sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.name} product={product} variant="preview" />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              className="spice-gradient inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-on-primary transition-transform hover:scale-105"
              href="/shop"
            >
              View All Masalas
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl px-4 py-12 sm:mx-4 sm:px-6 sm:py-16 md:mx-6 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-6 overflow-hidden rounded-3xl border border-[#d9bfa8]/50 bg-gradient-to-br from-[#fff7ee] via-[#fff0e2] to-[#ffe6d0] p-5 shadow-[0_24px_48px_-34px_rgba(92,31,16,0.8)] sm:p-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:p-12">
          <div>
            <p className="inline-flex rounded-full bg-[#f4d6bd] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7f2f12]">
              Brand Legacy
            </p>
            <h2 className="mt-4 font-headline text-2xl leading-tight text-[#4f1d0c] sm:text-3xl md:text-5xl">
              The Story of Our Company
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6a4637] sm:text-base md:text-lg">
              Born from family spice traditions, Veritraa blends heritage craft with modern quality systems to keep every
              batch rich in aroma, flavor depth, and kitchen-ready freshness.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#d6a887] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7f2f12]">
                Single-origin sourcing
              </span>
              <span className="rounded-full border border-[#d6a887] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7f2f12]">
                Lab-tested quality
              </span>
              <span className="rounded-full border border-[#d6a887] bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7f2f12]">
                Clean-label promise
              </span>
            </div>

            <Link
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#7f2f12] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#65250f] sm:px-8 sm:py-4 sm:text-base"
              href="/shop"
            >
              Explore Our Range
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              alt="Veritraa heritage"
              className="h-full w-full object-cover"
              src="/quality-section.png"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4f1d0c]/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="story-surface mx-2 mb-6 rounded-3xl py-14 sm:mx-4 sm:py-16 md:mx-6 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
          <div className="mb-10 flex flex-col items-center text-center sm:mb-12 md:mb-16">
            <span className="material-symbols-outlined mb-4 text-4xl text-primary">
              format_quote
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl">What Our Patrons Say</h2>
          </div>

          <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:hidden">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="min-w-[86%] snap-start rounded-[1.35rem] border border-[#dcc8b8]/65 bg-[#fffaf4] p-6 shadow-[0_18px_30px_-28px_rgba(52,26,14,0.85)]"
              >
                <p className="mb-5 text-sm italic leading-7 text-[#4d3328]">{`"${testimonial.quote}"`}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ead7c8] font-bold text-[#7f2f12]">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#4f1d0c]">{testimonial.name}</p>
                    <p className="text-xs text-[#7f5a4a]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden grid-cols-1 gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className={`rounded-[1.5rem] border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-sm ${
                  testimonial.featured ? 'z-10 md:scale-[1.03]' : ''
                }`}
              >
                <p className="mb-6 text-sm italic leading-7 text-on-surface">{`"${testimonial.quote}"`}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container font-bold text-primary">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{testimonial.name}</p>
                    <p className="text-xs text-on-surface-variant">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
