'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/site/CartProvider';

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode || 'INR',
  }).format(Number(amount || 0));
}

export default function CartPageClient() {
  const { cart, isLoading, error, removeLine, updateLineQuantity } = useCart();

  return (
    <div className="pb-16 pt-6 text-on-background sm:pb-20 sm:pt-8">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
        ) : null}

        {!cart || cart.lines.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-[#d9bfa8]/55 bg-white/85 p-8 text-center shadow-[0_18px_36px_-28px_rgba(112,56,18,0.2)]">
            <p className="text-lg font-semibold text-[#4f1d0c]">Your cart is empty.</p>
            <p className="mt-2 text-sm text-[#6a4637]">Add a masala from the product page to continue.</p>
            <Link
              href="/shop"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#8f350f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6f2507]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex flex-col gap-4 rounded-[1.6rem] border border-[#d9bfa8]/55 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(112,56,18,0.2)] sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#f7ead8]">
                    {line.merchandise.product.featuredImage ? (
                      <Image
                        alt={line.merchandise.product.featuredImage.altText ?? line.merchandise.product.title}
                        fill
                        className="object-cover"
                        src={line.merchandise.product.featuredImage.url}
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#4f1d0c]">{line.merchandise.product.title}</p>
                    <p className="mt-1 text-sm text-[#6a4637]">{line.merchandise.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[#8f350f]">
                      {formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-full border border-[#d9bfa8] px-3 py-2 text-sm font-semibold text-[#6f2507]"
                      disabled={isLoading || line.quantity <= 1}
                      onClick={() => {
                        void updateLineQuantity(line.id, line.quantity - 1);
                      }}
                      type="button"
                    >
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-semibold text-[#4f1d0c]">{line.quantity}</span>
                    <button
                      className="rounded-full border border-[#d9bfa8] px-3 py-2 text-sm font-semibold text-[#6f2507]"
                      disabled={isLoading}
                      onClick={() => {
                        void updateLineQuantity(line.id, line.quantity + 1);
                      }}
                      type="button"
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-800"
                    disabled={isLoading}
                    onClick={() => {
                      void removeLine(line.id);
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <aside className="rounded-[1.6rem] border border-[#d9bfa8]/55 bg-white/90 p-6 shadow-[0_18px_36px_-28px_rgba(112,56,18,0.2)]">
              <h2 className="font-headline text-2xl text-[#4f1d0c]">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm text-[#6a4637]">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{cart.totalQuantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#4f1d0c]">
                    {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-[#ead6c0] pt-3">
                  <span>Total</span>
                  <span className="font-semibold text-[#4f1d0c]">
                    {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
                  </span>
                </div>
              </div>

              <a
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8f350f] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6f2507]"
                href={cart.checkoutUrl}
              >
                Proceed to payment
              </a>
              <p className="mt-3 text-xs leading-5 text-[#7e5a4b]">
                Checkout is powered by Shopify. Payment options like Razorpay are controlled in Shopify, not in this codebase.
              </p>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}