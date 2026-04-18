'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';

type LikeSummary = {
  liked: boolean;
  totalLikes: number;
};

export default function ProductLikeButton({
  productSlug,
}: Readonly<{
  productSlug: string;
}>) {
  const { openAuthDialog } = useFirebaseCustomerAuth();
  const [summary, setSummary] = useState<LikeSummary>({ liked: false, totalLikes: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadLikes() {
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/likes`, {
          cache: 'no-store',
        });

        const payload = (await response.json()) as {
          ok?: boolean;
          error?: string;
          data?: LikeSummary;
        };

        if (!response.ok || !payload.data) {
          return;
        }

        if (!cancelled) {
          setSummary(payload.data);
        }
      } catch {
        // Ignore initial loading issues; the button still works.
      }
    }

    void loadLikes();

    return () => {
      cancelled = true;
    };
  }, [productSlug]);

  async function toggleLike() {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        data?: LikeSummary;
      };

      if (response.status === 401) {
        openAuthDialog();
        throw new Error(payload.error ?? 'Login required to like this product.');
      }

      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? 'Unable to update your like.');
      }

      setSummary(payload.data);
      setMessage(payload.data.liked ? 'Saved to your likes.' : 'Removed from your likes.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update your like.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition ${
          summary.liked
            ? 'border-[#8a3a17] bg-[#8a3a17] text-white shadow-[0_14px_30px_-18px_rgba(157,70,11,0.45)]'
            : 'border-[#dbc1b7] bg-white text-[#8a3a17] hover:border-[#8a3a17] hover:bg-[#fff6ef]'
        }`}
        disabled={loading}
        onClick={() => {
          void toggleLike();
        }}
        type="button"
      >
        <Heart className={summary.liked ? 'fill-current' : ''} size={16} />
        {loading ? 'Updating...' : summary.liked ? 'Liked' : 'Like this product'}
      </button>
      <p className="text-center text-xs uppercase tracking-[0.14em] text-[#7f5a4a]">
        {summary.totalLikes} customer{summary.totalLikes === 1 ? '' : 's'} like this
      </p>
      {message ? <p className="text-sm text-[#6a4637]">{message}</p> : null}
    </div>
  );
}