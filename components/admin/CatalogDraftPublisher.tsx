'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type CatalogDraft = {
  slug: string;
  handle: string;
  title: string;
  price: string;
  quantity: number;
  productType: string;
  tags: string[];
};

type Notice = {
  tone: 'success' | 'error';
  message: string;
} | null;

export default function CatalogDraftPublisher({
  drafts,
}: Readonly<{
  drafts: CatalogDraft[];
}>) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice>(null);

  const visibleDrafts = useMemo(
    () => drafts.filter((draft) => !completed.includes(draft.slug)),
    [completed, drafts]
  );

  async function pushDraft(slug: string) {
    setBusy(slug);
    setNotice(null);

    try {
      const response = await fetch('/api/admin/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'push-local-product',
          slug,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Unable to push product to Shopify.');
      }

      setCompleted((current) => [...current, slug]);
      setNotice({ tone: 'success', message: 'Product pushed to Shopify successfully.' });
      router.refresh();
    } catch (error) {
      setNotice({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Unable to push product to Shopify.',
      });
    } finally {
      setBusy(null);
    }
  }

  if (!visibleDrafts.length) {
    return (
      <div className="rounded-[1.6rem] border border-[#d8bea2]/70 bg-white/90 p-6 text-sm text-[#6f4b3f] shadow-[0_18px_40px_-34px_rgba(85,33,16,0.35)]">
        Every local catalog item already exists on Shopify.
      </div>
    );
  }

  return (
    <section className="rounded-[1.6rem] border border-[#d8bea2]/70 bg-white/90 p-6 shadow-[0_18px_40px_-34px_rgba(85,33,16,0.35)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a04a1d]">Local drafts</p>
        <h2 className="font-headline text-3xl text-[#4b1f0f]">Push hidden catalog products to Shopify</h2>
        <p className="max-w-3xl text-sm leading-6 text-[#755245]">
          These products exist in the local catalog but are not live on Shopify yet, so they are hidden from the storefront.
          Push any item below to create it in Shopify and make it eligible for the storefront.
        </p>
      </div>

      {notice ? (
        <div
          className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
            notice.tone === 'success'
              ? 'border border-green-200 bg-green-50 text-green-900'
              : 'border border-red-200 bg-red-50 text-red-900'
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleDrafts.map((draft) => (
          <article key={draft.slug} className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
            <p className="text-lg font-semibold text-[#4b1f0f]">{draft.title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">{draft.handle}</p>
            <div className="mt-4 space-y-1.5 text-sm text-[#6f4b3f]">
              <p>Type: {draft.productType}</p>
              <p>Price: INR {draft.price}</p>
              <p>Opening stock: {draft.quantity}</p>
              <p>Tags: {draft.tags.slice(0, 3).join(', ')}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                void pushDraft(draft.slug);
              }}
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#8a3a17] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy === draft.slug}
            >
              {busy === draft.slug ? 'Pushing...' : 'Push To Shopify'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
