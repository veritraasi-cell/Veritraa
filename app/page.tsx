import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BadgeCheck, Leaf, MessageSquareQuote, Star, Wind } from 'lucide-react';
import CloserLookCarousel from '@/components/site/CloserLookCarousel';
import HeritageHero from '@/components/site/HeritageHero';
import ProductCard from '@/components/site/ProductCard';
import {
  homeBenefits,
  testimonials,
} from '@/src/data/mockData';
import { getLiveShopProducts } from '@/src/lib/liveCatalog';

export default async function HomePage() {
  const shopProducts = await getLiveShopProducts();
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

  const benefitIcons = {
    Purity: BadgeCheck,
    Aroma: Wind,
    'Hand-picked': Leaf,
  } as const;

  return (
    <>
      <HeritageHero />

      <section className="story-surface mx-auto mt-5 max-w-screen-2xl rounded-3xl px-4 py-14 sm:px-6 sm:py-16 md:mt-6 md:px-8 md:py-24" id="collections">
        <div className="mb-10 sm:mb-12 md:mb-16">
          <h2 className="font-headline text-2xl text-on-background sm:text-3xl md:text-4xl">Shop Our Signature Range</h2>
          <p className="mt-3 hidden text-sm text-on-surface-variant sm:block sm:text-base">Handpicked masalas and spice blends curated for modern kitchens</p>
          <div className="mt-2 sm:hidden -mx-4">
            <div className="no-scrollbar flex w-full gap-3 overflow-x-auto px-4">
              <p className="mobile-single-line inline-block text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant min-w-max">Jeera | Haldi | Dhaniya | Garam</p>
              <p className="mobile-single-line inline-block text-[10px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant min-w-max">Purity | Aroma | Handpicked</p>
            </div>
          </div>
          <div className="mt-4 h-1 w-24 rounded-full bg-primary" />
        </div>

        <div className="no-scrollbar grid grid-flow-col auto-cols-[46%] gap-3 overflow-x-auto pb-1 sm:grid-cols-3 sm:auto-cols-auto sm:overflow-visible sm:pb-0 sm:gap-5 lg:grid-cols-4">
          {shopProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.name} href={`/shop/${product.slug}`} product={product} variant="preview" />
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

      <section className="story-surface mx-2 rounded-3xl px-4 py-10 sm:mx-4 sm:px-6 sm:py-14 md:mx-6 md:px-8 md:py-20">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-8 sm:mb-10 md:mb-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a04100]">Brand Gallery</p>
              <h2 className="mt-2 font-headline text-2xl text-on-background sm:text-3xl md:text-4xl">
                A closer look at Veritraa
              </h2>
            </div>
          </div>

          <CloserLookCarousel />
        </div>
      </section>

      <section className="story-surface mx-2 rounded-3xl px-4 py-10 sm:mx-4 sm:px-6 sm:py-14 md:mx-6 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-8 xl:gap-12">
          {homeBenefits.map((benefit) => {
            const accentClass =
              benefit.accent === 'secondary'
                ? 'bg-secondary-container text-on-secondary-container'
                : benefit.accent === 'primary'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-tertiary-container text-on-tertiary-container';
            const BenefitIcon = benefitIcons[benefit.title as keyof typeof benefitIcons];

            return (
              <div
                key={benefit.title}
                className="flex flex-col items-center gap-3 rounded-2xl border border-white/55 bg-white/72 px-4 py-5 text-center shadow-[0_18px_40px_-34px_rgba(82,28,4,0.32)] backdrop-blur-sm sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-8"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm sm:h-16 sm:w-16 ${accentClass}`}>
                  <BenefitIcon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.2} />
                </div>
                <h4 className="font-headline text-base sm:text-xl">{benefit.title}</h4>
                <p className="max-w-xs text-sm leading-6 text-on-surface-variant sm:text-base">
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
          <div className="md:col-span-7 md:flex md:items-center">
            <div className="relative z-10 w-full overflow-hidden rounded-lg border-4 border-[#E8A800]/30 bg-[#fff8ef] shadow-2xl">
              <Image
                alt="Veritraa story"
                src="/mainimg.png"
                width={2752}
                height={1536}
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                className="h-auto w-full object-cover object-center"
              />
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
          <div className="relative mt-10 overflow-hidden rounded-[1.4rem] border border-[#E8A800]/35 border-t-2 bg-gradient-to-r from-[#8b1d1d] to-[#a04100] px-5 py-6 text-white shadow-[0_18px_38px_-30px_rgba(92,31,16,0.85)] sm:mt-14 sm:px-8 sm:py-8 md:mt-16 md:px-10 md:py-10">
            <div className="absolute inset-0 opacity-10 pointer-events-none" />
            <div className="relative z-10 mx-auto max-w-3xl space-y-4 text-center sm:space-y-5">
              <Leaf className="mx-auto h-8 w-8 text-[#E8A800] sm:h-10 sm:w-10" />
              <h3 className="text-xl font-serif text-[#E8A800] sm:text-2xl md:text-3xl">A Commitment to Heritage</h3>
              <p className="text-sm font-light leading-6 text-[#f9f3eb] sm:text-[15px] sm:leading-7 md:text-base md:leading-8">
                Veritraa is more than a spice brand; it&rsquo;s a bridge between the hardworking farmers of India and your kitchen. We celebrate the alchemy of tradition and science to bring you the purest flavors.
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-3 sm:gap-3 sm:pt-4">
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/18 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-5 sm:text-xs">Direct From Farmers</span>
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/18 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-5 sm:text-xs">Lab Tested Purity</span>
                <span className="rounded-full border border-[#E8A800]/40 bg-[#E8A800]/18 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#E8A800] sm:px-5 sm:text-xs">Women-Led Supply</span>
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

          <div className="no-scrollbar grid grid-flow-col auto-cols-[46%] gap-3 overflow-x-auto pb-1 sm:auto-cols-[35%] sm:gap-4 md:auto-cols-[28%] md:gap-5 lg:auto-cols-[22%]">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.name} href={`/shop/${product.slug}`} product={product} variant="preview" compact={true} />
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
            <Image
              alt="Veritraa heritage"
              className="h-full w-full object-cover"
              src="/quality-section.png"
              width={1536}
              height={1024}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4f1d0c]/40 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      <section className="story-surface mx-2 mb-6 rounded-3xl py-14 sm:mx-4 sm:py-16 md:mx-6 md:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 md:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a04100]">Patron Stories</p>
              <h2 className="mt-2 font-headline text-2xl text-on-background sm:text-3xl">What Our Patrons Say</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-on-surface-variant sm:text-base">
              Trusted by home cooks, food creators, and kitchen professionals who value flavor, consistency, and purity.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className={`overflow-hidden rounded-[1.5rem] border border-[#dcc8b8]/75 bg-[linear-gradient(180deg,rgba(255,251,245,0.95),rgba(246,232,214,0.92))] p-6 shadow-[0_18px_40px_-34px_rgba(92,31,16,0.45)] sm:p-7 ${testimonial.featured ? 'md:-mt-2 md:scale-[1.02] md:shadow-[0_24px_54px_-34px_rgba(92,31,16,0.58)]' : ''}`}
              >
                <MessageSquareQuote className="h-7 w-7 text-[#a04100]/55" strokeWidth={1.8} />
                <p className="mt-4 text-sm leading-7 text-[#4d3328] sm:text-base">{`“${testimonial.quote}”`}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ead7c8] font-bold text-[#7f2f12]">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#4f1d0c]">{testimonial.name}</p>
                    <p className="text-xs text-[#7f5a4a]">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
