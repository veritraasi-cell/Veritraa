'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminProductRowActions({
  productId,
  editableSlug,
}: Readonly<{
  productId: string;
  editableSlug?: string | null;
}>) {
  const router = useRouter();
  const [busyAction, setBusyAction] = useState<'delete' | null>(null);

  async function handleDelete() {
    setBusyAction('delete');

    try {
      const response = await fetch('/api/admin/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete-catalog-product',
          productId,
          slug: editableSlug ?? undefined,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Unable to delete product.');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to delete product.');
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {editableSlug ? (
        <button
          type="button"
          onClick={() => {
            router.push(`/admin/products?edit=${encodeURIComponent(editableSlug)}#product-creator`);
          }}
          className="rounded-full border border-[#d8a36f] bg-white px-3 py-1 text-xs font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
        >
          Update
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void handleDelete();
        }}
        disabled={busyAction === 'delete'}
        className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-900 transition hover:bg-red-100 disabled:opacity-60"
      >
        {busyAction === 'delete' ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
