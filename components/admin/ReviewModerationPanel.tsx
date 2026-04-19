'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ReviewModerationRecord = {
  id: string;
  productSlug: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  rating: number;
  comment: string;
  adminReply: string | null;
  adminReplyBy: string | null;
  adminReplyAt: string | null;
  createdAt: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatStars(rating: number) {
  return `${'★'.repeat(Math.max(0, Math.min(5, rating)))}${'☆'.repeat(Math.max(0, 5 - rating))}`;
}

function buildReviewStatus(review: ReviewModerationRecord) {
  return review.adminReply ? 'Replied' : 'Awaiting reply';
}

export default function ReviewModerationPanel({
  initialReviews,
}: Readonly<{
  initialReviews: ReviewModerationRecord[];
}>) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReviewId, setSelectedReviewId] = useState(initialReviews[0]?.id ?? null);
  const [replyDraft, setReplyDraft] = useState(initialReviews[0]?.adminReply ?? '');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<'reply' | 'delete' | null>(null);

  useEffect(() => {
    setReviews(initialReviews);
    setSelectedReviewId(initialReviews[0]?.id ?? null);
    setReplyDraft(initialReviews[0]?.adminReply ?? '');
    setNotice(null);
  }, [initialReviews]);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) ?? null,
    [reviews, selectedReviewId]
  );

  useEffect(() => {
    if (!selectedReview) {
      setReplyDraft('');
      return;
    }

    setReplyDraft(selectedReview.adminReply ?? '');
  }, [selectedReview?.id]);

  useEffect(() => {
    if (!reviews.length) {
      setSelectedReviewId(null);
      setReplyDraft('');
      return;
    }

    if (!selectedReviewId || !reviews.some((review) => review.id === selectedReviewId)) {
      setSelectedReviewId(reviews[0].id);
    }
  }, [reviews, selectedReviewId]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return reviews;
    }

    return reviews.filter((review) => {
      return [review.productName, review.productSlug, review.customerName, review.customerEmail, review.comment, review.adminReply]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [reviews, search]);

  const stats = useMemo(() => {
    const replied = reviews.filter((review) => Boolean(review.adminReply?.trim())).length;

    return {
      total: reviews.length,
      replied,
      pending: reviews.length - replied,
      latest: reviews[0] ?? null,
    };
  }, [reviews]);

  async function updateReviewReply() {
    if (!selectedReview) {
      return;
    }

    setBusyAction('reply');
    setNotice(null);

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug: selectedReview.productSlug,
          reviewId: selectedReview.id,
          reply: replyDraft,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: { message?: string };
        data?: { review?: ReviewModerationRecord };
      };

      if (!response.ok || !payload.success || !payload.data?.review) {
        throw new Error(payload.error?.message ?? 'Unable to save reply.');
      }

      const updatedReview = payload.data.review;
      setReviews((current) => current.map((review) => (review.id === updatedReview.id ? updatedReview : review)));
      setSelectedReviewId(updatedReview.id);
      setReplyDraft(updatedReview.adminReply ?? '');
      setNotice(updatedReview.adminReply ? 'Reply saved.' : 'Reply cleared.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save reply.');
    } finally {
      setBusyAction(null);
    }
  }

  async function removeReview() {
    if (!selectedReview) {
      return;
    }

    const confirmed = window.confirm(
      `Remove the review from ${selectedReview.customerName}? This deletes it from the storefront.`
    );

    if (!confirmed) {
      return;
    }

    setBusyAction('delete');
    setNotice(null);

    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug: selectedReview.productSlug,
          reviewId: selectedReview.id,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? 'Unable to delete review.');
      }

      const remainingReviews = reviews.filter((review) => review.id !== selectedReview.id);
      const nextReview = remainingReviews[0] ?? null;

      setReviews(remainingReviews);
      setSelectedReviewId(nextReview?.id ?? null);
      setReplyDraft(nextReview?.adminReply ?? '');
      setNotice('Review removed from the storefront.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to delete review.');
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[#4f2d21]/14 bg-white/90 p-6 shadow-[0_20px_52px_-36px_rgba(63,28,16,0.35)] sm:p-8">
        <p className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
          Moderation
        </p>
        <h1 className="mt-4 font-headline text-3xl leading-tight text-[#4b1f0f] sm:text-5xl">Reviews and comments</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#734f42] sm:text-base">
          Reply to customer comments as the owner, or remove abusive reviews from the storefront entirely. Replies are shown
          publicly and deletions remove the review document.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c5f4d]">Total reviews</p>
            <p className="mt-2 text-2xl font-bold text-[#5b2410]">{stats.total}</p>
          </div>
          <div className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c5f4d]">Owner replies</p>
            <p className="mt-2 text-2xl font-bold text-[#5b2410]">{stats.replied}</p>
          </div>
          <div className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c5f4d]">Awaiting reply</p>
            <p className="mt-2 text-2xl font-bold text-[#5b2410]">{stats.pending}</p>
          </div>
          <div className="rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c5f4d]">Latest review</p>
            <p className="mt-2 text-sm font-semibold text-[#5b2410]">{stats.latest ? stats.latest.customerName : 'None yet'}</p>
            <p className="mt-1 text-xs text-[#7f5a4a]">{stats.latest ? formatDateTime(stats.latest.createdAt) : 'No review activity yet.'}</p>
          </div>
        </div>

        {notice ? (
          <div className="mt-6 rounded-2xl border border-[#ead7c4] bg-[#fff8ef] px-4 py-3 text-sm text-[#6f4b3f]">
            {notice}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Review queue</CardTitle>
                <CardDescription>Click a row to inspect the full comment and respond.</CardDescription>
              </div>
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer, product, or comment"
                className="sm:max-w-xs"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-[1.35rem] border border-[#ead7c4] bg-[#fffaf4]">
              <table className="min-w-full divide-y divide-[#ead7c4] text-left text-sm">
                <thead className="bg-[#fff1e1] text-xs uppercase tracking-[0.14em] text-[#8c5f4d]">
                  <tr>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0dfd0] bg-white">
                  {filteredReviews.length ? (
                    filteredReviews.map((review) => {
                      const active = review.id === selectedReviewId;

                      return (
                        <tr
                          key={review.id}
                          className={`cursor-pointer transition hover:bg-[#fffaf4] ${active ? 'bg-[#fff1e1]' : ''}`}
                          onClick={() => setSelectedReviewId(review.id)}
                        >
                          <td className="px-4 py-4 align-top">
                            <p className="font-semibold text-[#4b1f0f]">{review.customerName}</p>
                            <p className="text-xs text-[#7f5a4a]">{review.customerEmail}</p>
                          </td>
                          <td className="px-4 py-4 align-top text-[#6f4b3f]">
                            <p className="font-semibold text-[#4b1f0f]">{review.productName}</p>
                            <p className="text-xs text-[#7f5a4a]">{review.productSlug}</p>
                          </td>
                          <td className="px-4 py-4 align-top font-semibold text-[#6b2b12]">{formatStars(review.rating)}</td>
                          <td className="px-4 py-4 align-top">
                            <span className="inline-flex rounded-full bg-[#f4d8ba] px-2 py-1 text-xs font-semibold text-[#7a2f19]">
                              {buildReviewStatus(review)}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-[#6f4b3f]">{formatDateTime(review.createdAt)}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="px-4 py-8 text-sm text-[#7f5a4a]" colSpan={5}>
                        No reviews match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedReview ? selectedReview.customerName : 'Review detail'}</CardTitle>
            <CardDescription>
              {selectedReview
                ? 'Inspect the customer context, write an owner reply, or remove the review.'
                : 'Choose a review from the table to manage it.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-[#6f4b3f]">
            {selectedReview ? (
              <>
                <div className="rounded-2xl border border-[#ead7c4] bg-[#fffaf4] p-4">
                  <p className="font-semibold text-[#4b1f0f]">{selectedReview.productName}</p>
                  <p className="mt-1 text-xs text-[#7f5a4a]">{selectedReview.productSlug}</p>
                  <p className="mt-3 font-semibold text-[#6b2b12]">{formatStars(selectedReview.rating)}</p>
                  <p className="mt-1">{formatDateTime(selectedReview.createdAt)}</p>
                </div>

                <div className="rounded-2xl border border-[#ead7c4] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c5f4d]">Customer</p>
                  <p className="mt-2 font-semibold text-[#4b1f0f]">{selectedReview.customerName}</p>
                  <p className="mt-1">{selectedReview.customerEmail}</p>
                  <p className="mt-1">{selectedReview.customerPhone ?? 'No phone on file'}</p>
                </div>

                <div className="rounded-2xl border border-[#ead7c4] bg-[#fffaf4] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c5f4d]">Comment</p>
                  <p className="mt-2 leading-6 text-[#55433b]">{selectedReview.comment}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8c5f4d]" htmlFor="reply">
                    Owner reply
                  </label>
                  <textarea
                    id="reply"
                    value={replyDraft}
                    onChange={(event) => setReplyDraft(event.target.value)}
                    placeholder="Write a public response. Leave empty to clear the reply."
                    className="min-h-32 w-full rounded-2xl border border-[#dfc5ae] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#c98a5d]"
                  />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        void updateReviewReply();
                      }}
                      disabled={busyAction === 'reply'}
                      className="rounded-2xl bg-[#8a3a17] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6e2e11] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyAction === 'reply' ? 'Saving...' : 'Save reply'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        void removeReview();
                      }}
                      disabled={busyAction === 'delete'}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyAction === 'delete' ? 'Removing...' : 'Remove review'}
                    </button>
                  </div>
                </div>

                <Link
                  href={`/shop/${encodeURIComponent(selectedReview.productSlug)}`}
                  className="inline-flex rounded-2xl border border-[#d8a36f] bg-white px-4 py-3 text-sm font-semibold text-[#8a3a17] transition hover:bg-[#f8ebdf]"
                >
                  Open storefront product
                </Link>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d8bea2] bg-[#fffaf4] p-4 text-[#7f5a4a]">
                No review selected.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}