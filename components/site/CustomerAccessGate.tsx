'use client';

import { LockKeyhole, Sparkles } from 'lucide-react';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';

export default function CustomerAccessGate({
  title,
  description,
}: Readonly<{
  title: string;
  description: string;
}>) {
  const { openAuthDialog, authError } = useFirebaseCustomerAuth();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-[#e2c8b4]/75 bg-[linear-gradient(180deg,#fff9f2,#fff1df)] p-8 shadow-[0_24px_60px_-38px_rgba(82,28,4,0.55)] sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f2c69c] bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#99461e]">
          <LockKeyhole size={14} />
          Login required
        </div>

        <h1 className="mt-5 font-headline text-4xl text-[#1d1c18] sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#55433b] sm:text-base">{description}</p>

        {authError ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {authError}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            className="spice-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(157,70,11,0.55)] transition hover:scale-[1.02]"
            onClick={openAuthDialog}
            type="button"
          >
            <Sparkles size={16} />
            Open Google login
          </button>
          <span className="text-xs uppercase tracking-[0.18em] text-[#7f5a4a]">
            Shopping, comments, likes, and order history stay locked until sign-in.
          </span>
        </div>
      </div>
    </section>
  );
}