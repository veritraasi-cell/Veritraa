'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BulkProductActions({ unpushedCount = 0 }: Readonly<{ unpushedCount?: number }>) {
  const router = useRouter();
  const [busyAction, setBusyAction] = useState<'empty' | 'push' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleEmptyStore() {
    const confirmed = window.confirm(
      '⚠️ This will permanently delete ALL products from both Shopify and Firebase. This cannot be undone. Are you sure?'
    );
    if (!confirmed) return;

    setBusyAction('empty');
    setMessage(null);

    try {
      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'empty-store',
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        data?: { message: string; deleted: { shopify: number; firebase: number } };
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Unable to empty store.');
      }

      setMessage({
        type: 'success',
        text: `Store emptied! Deleted ${payload.data?.deleted.shopify ?? 0} Shopify products and ${payload.data?.deleted.firebase ?? 0} Firebase items.`,
      });

      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to empty store.',
      });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleBulkPush() {
    const confirmed = window.confirm(
      `🚀 This will push ${unpushedCount} item(s) to the storefront. They will become live and visible on the website. Continue?`
    );
    if (!confirmed) return;

    setBusyAction('push');
    setMessage(null);

    try {
      const response = await fetch('/api/admin/bulk-operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-push',
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        error?: string;
        data?: { message: string; pushed: number };
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Unable to push products.');
      }

      setMessage({
        type: 'success',
        text: `✅ Successfully pushed ${payload.data?.pushed ?? 0} item(s) to the storefront! They are now live on your website and Shopify.`,
      });

      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to push products.',
      });
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <div className="space-y-4" id="bulk-push">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#4b1f0f]">Bulk Operations</p>
          <p className="text-xs text-[#7f5a4a]">
            {unpushedCount > 0 ? `${unpushedCount} item(s) in queue` : 'All items pushed'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/queue"
            className="inline-flex items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            📋 View Queue ({unpushedCount})
          </Link>
          <button
            type="button"
            onClick={() => {
              void handleBulkPush();
            }}
            disabled={busyAction !== null || unpushedCount === 0}
            className="inline-flex items-center justify-center rounded-2xl border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-900 transition hover:bg-green-100 disabled:opacity-60"
          >
            {busyAction === 'push' ? '⏳ Pushing...' : '🚀 Bulk Push All'}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleEmptyStore();
            }}
            disabled={busyAction !== null}
            className="inline-flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:opacity-60"
          >
            {busyAction === 'empty' ? '⏳ Emptying...' : '🗑️ Empty Store'}
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`rounded-[1.5rem] border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-green-300 bg-green-50 text-green-900'
              : 'border-red-300 bg-red-50 text-red-900'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
