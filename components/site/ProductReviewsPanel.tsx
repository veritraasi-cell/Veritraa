'use client';

import { useEffect, useState } from 'react';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';

type CustomerSession = {
  id: string;
  email: string;
  name: string;
  photoURL?: string | null;
};

type ProductReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  adminReply: string | null;
  adminReplyBy: string | null;
  adminReplyAt: string | Date | null;
  createdAt: string | Date;
};

export default function ProductReviewsPanel({
  productSlug,
  initialReviews,
  initialSession,
}: Readonly<{
  productSlug: string;
  initialReviews: ProductReview[];
  initialSession: CustomerSession | null;
}>) {
  const [reviews, setReviews] = useState(initialReviews);
  const [session, setSession] = useState(initialSession);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: '5',
    comment: '',
  });
  const { openAuthDialog } = useFirebaseCustomerAuth();

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  async function submitReview() {
    setBusy(true);
    setNotice(null);

    try {
      const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; data?: { review: ProductReview } };
      if (response.status === 401) {
        openAuthDialog();
        throw new Error(payload.error ?? 'Please log in before posting a review.');
      }

      if (!response.ok) {
        throw new Error(payload.error ?? 'Unable to post review.');
      }

      const nextReview = payload.data?.review;

      if (nextReview) {
        setReviews((current) => [nextReview, ...current]);
      }

      setReviewForm({
        rating: '5',
        comment: '',
      });
      setNotice('Review posted successfully.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to post review.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-16 rounded-[2rem] border border-[#dbc1b7]/50 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#99461e]">Customer reviews</p>
        <h3 className="font-headline text-3xl text-[#1d1c18]">Comments and ratings</h3>
        <p className="text-sm leading-6 text-[#55433b]">
          Read what other customers are saying, and sign in when you want to add your own comment.
        </p>
      </div>

      {notice ? (
        <div className="mt-4 rounded-2xl border border-[#ead7c4] bg-[#fff8ef] px-4 py-3 text-sm text-[#6f4b3f]">
          {notice}
        </div>
      ) : null}

      {!session ? (
        <div className="mt-6 rounded-[1.5rem] border border-[#ead7c4] bg-[#fffaf4] p-5 text-sm leading-6 text-[#55433b]">
          <p>Browse all comments freely. Sign in when you are ready to write and submit your own review.</p>
          <button
            type="button"
            onClick={openAuthDialog}
            className="mt-4 rounded-full bg-[#8a3a17] px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in to comment
          </button>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.5rem] border border-[#ead7c4] bg-[#fffaf4] p-5">
          <div className="rounded-2xl border border-[#e6cdb3] bg-white/80 px-4 py-3">
            <p className="text-sm font-semibold text-[#1d1c18]">Posting as {session.name}</p>
            <p className="mt-1 text-xs text-[#7f5a4a]">Your comment will appear publicly with your name.</p>
          </div>
          <div className="mt-4 grid gap-3">
            <select
              className="rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none"
              value={reviewForm.rating}
              onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}
            >
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <textarea
              className="min-h-28 rounded-2xl border border-[#dfc5ae] px-4 py-3 outline-none"
              placeholder="Share your comment"
              value={reviewForm.comment}
              onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
            />
            <button
              type="button"
              onClick={() => {
                void submitReview();
              }}
              disabled={busy}
              className="rounded-2xl bg-[#8a3a17] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Posting...' : 'Post review'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {reviews.length ? (
          reviews.map((review) => (
            <article key={review.id} className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1d1c18]">{review.customerName}</p>
                </div>
                <p className="text-sm font-semibold text-[#99461e]">{'\u2605'.repeat(review.rating)}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#55433b]">{review.comment}</p>
              {review.adminReply ? (
                <div className="mt-4 rounded-2xl border border-[#e6cdb3] bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a3a17]">
                    {review.adminReplyBy ? `${review.adminReplyBy} replied` : 'Owner reply'}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#55433b]">{review.adminReply}</p>
                </div>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4 text-sm text-[#55433b]">
            No comments or ratings yet for this product.
          </div>
        )}
      </div>
    </section>
  );
}
