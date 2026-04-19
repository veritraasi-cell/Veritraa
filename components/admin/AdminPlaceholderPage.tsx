import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AdminPlaceholderPage({
  eyebrow,
  title,
  description,
  stats,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  stats?: Array<{ label: string; value: string; note?: string }>;
  children?: ReactNode;
}>) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/88 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <p className="inline-flex items-center rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">{description}</p>

        {stats?.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c5f4d]">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-[#5b2410]">{stat.value}</p>
                {stat.note ? <p className="mt-1 text-xs leading-5 text-[#7f5a4a]">{stat.note}</p> : null}
              </div>
            ))}
          </div>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="rounded-2xl bg-[#8a3a17] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11]"
          >
            Back to dashboard
          </Link>
          <Link
            href="/"
            className="rounded-2xl border border-[#d8a36f] bg-white px-5 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
          >
            View storefront
          </Link>
        </div>
      </div>
    </section>
  );
}
