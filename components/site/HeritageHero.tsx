import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Globe2, Leaf, ShieldCheck } from 'lucide-react';

const heroHighlights = [
  {
    icon: Leaf,
    title: 'Farm-selected origins',
    copy: 'Ingredients chosen for aroma, freshness, and regional character.',
  },
  {
    icon: ShieldCheck,
    title: 'Clean-label purity',
    copy: 'Packed hygienically with no fillers, shortcuts, or compromise.',
  },
  {
    icon: Globe2,
    title: 'Retail to export ready',
    copy: 'Built for home kitchens, gifting, and larger-volume requirements.',
  },
];

export default function HeritageHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#1c140f] sm:min-h-[calc(100svh-78px)] md:min-h-[calc(100svh-92px)]">
        <Image
          src="/hero-heritage-spices.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center [filter:brightness(1.06)_saturate(1.08)_sepia(0.1)]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,210,124,0.2),transparent_24%),radial-gradient(circle_at_84%_20%,rgba(255,135,61,0.12),transparent_18%),linear-gradient(180deg,rgba(20,19,13,0.18)_0%,rgba(20,19,13,0.26)_34%,rgba(20,19,13,0.58)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,22,16,0.5)_0%,rgba(18,22,16,0.2)_28%,rgba(18,22,16,0.12)_54%,rgba(18,22,16,0.34)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_50%_110%,rgba(245,158,11,0.32),transparent_46%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(32,24,14,0.12),transparent)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-72px)] max-w-6xl flex-col items-center justify-center px-4 py-14 text-center sm:min-h-[calc(100svh-78px)] sm:px-6 sm:py-16 md:min-h-[calc(100svh-92px)] md:px-8 md:py-20">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.38em] text-[#f8cf65] sm:text-xs">
            <span className="h-px w-8 bg-[#f59e0b]/60 sm:w-12" />
            Sensory Heritage
            <span className="h-px w-8 bg-[#f59e0b]/60 sm:w-12" />
          </p>

          <h1 className="max-w-5xl font-headline text-4xl leading-[0.95] text-white drop-shadow-[0_18px_36px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]">
            The World&apos;s Finest
            <span className="mt-2 block bg-[linear-gradient(120deg,#ffe39b_0%,#f59e0b_48%,#ffd76b_100%)] bg-clip-text text-transparent">
              Spices &amp; Dry Fruits
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base font-light leading-7 text-[#f5efe7] sm:text-lg sm:leading-8 md:text-xl">
            Curating the most authentic, hand-picked treasures from nature. Elevate your culinary experience with the
            pure essence of Veritraa.
          </p>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f6d68c]/85 sm:text-xs">
            No additives. No fillers. No compromise.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-[#f59e0b] px-6 py-4 text-sm font-bold text-white shadow-[0_16px_40px_-18px_rgba(245,158,11,0.7)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#e69209] sm:text-base"
            >
              Explore Collection
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-5xl grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {heroHighlights.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-[1.1rem] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.13),rgba(255,255,255,0.06))] px-2.5 py-3 text-left shadow-[0_24px_54px_-36px_rgba(0,0,0,0.68)] backdrop-blur-[14px] sm:rounded-[1.35rem] sm:px-4 sm:py-4 md:rounded-[1.5rem] md:px-6 md:py-5">
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b]/16 text-[#f8cf65] sm:h-10 sm:w-10 md:h-11 md:w-11">
                    <Icon size={16} className="sm:h-[18px] sm:w-[18px] md:h-5 md:w-5" />
                  </div>
                  <h2 className="font-headline text-[13px] leading-tight text-white sm:text-base md:text-xl">{title}</h2>
                </div>
                <p className="mt-3 hidden text-sm leading-6 text-[#d4ddce] sm:block sm:text-[13px] sm:leading-5 md:text-[15px] md:leading-6">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
