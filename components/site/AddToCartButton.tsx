'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LoaderCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/components/site/CartProvider';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';
import type { StorefrontCart } from '@/components/site/cart-types';

type CartToast = {
  productName: string;
  quantity: number;
  imageUrl?: string | null;
};

function findLine(cart: StorefrontCart | null, merchandiseId: string) {
  return cart?.lines.find((line) => line.merchandise.id === merchandiseId) ?? null;
}

export default function AddToCartButton({
  merchandiseId,
  disabled = false,
}: Readonly<{
  merchandiseId: string;
  disabled?: boolean;
}>) {
  const { cart, addToCart, removeLine, updateLineQuantity } = useCart();
  const { openAuthDialog } = useFirebaseCustomerAuth();
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);

  const matchingLine = findLine(cart, merchandiseId);
  const quantity = matchingLine?.quantity ?? 0;

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function showToast(nextCart: StorefrontCart | null, fallbackQuantity: number) {
    const line = findLine(nextCart, merchandiseId) ?? matchingLine;

    setToast({
      productName: line?.merchandise.product.title ?? line?.merchandise.title ?? 'Product',
      quantity: line?.quantity ?? fallbackQuantity,
      imageUrl: line?.merchandise.product.featuredImage?.url ?? null,
    });
  }

  async function handleAddToCart() {
    setBusy(true);

    try {
      const nextCart = await addToCart(merchandiseId, 1);
      showToast(nextCart, 1);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('log in')) {
        openAuthDialog();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleIncrementQuantity() {
    if (!matchingLine) {
      await handleAddToCart();
      return;
    }

    setBusy(true);

    try {
      const nextCart = await updateLineQuantity(matchingLine.id, matchingLine.quantity + 1);
      showToast(nextCart, 1);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('log in')) {
        openAuthDialog();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDecrementQuantity() {
    if (!matchingLine) {
      return;
    }

    setBusy(true);

    try {
      if (matchingLine.quantity <= 1) {
        await removeLine(matchingLine.id);
      } else {
        await updateLineQuantity(matchingLine.id, matchingLine.quantity - 1);
      }
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('log in')) {
        openAuthDialog();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {quantity > 0 ? (
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9bfa8]/70 bg-white px-3 py-2 shadow-[0_14px_30px_-18px_rgba(157,70,11,0.35)]">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f7ead8] text-[#6f2507] transition hover:bg-[#eed8bf] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || busy}
              onClick={() => {
                void handleDecrementQuantity();
              }}
              type="button"
            >
              <Minus size={18} />
            </button>
            <span className="flex min-w-7 justify-center text-center text-sm font-bold text-[#4f1d0c]">
              {busy ? <LoaderCircle className="h-4 w-4 animate-spin text-[#8f350f]" /> : quantity}
            </span>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#8f350f] text-white transition hover:bg-[#6f2507] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disabled || busy}
              onClick={() => {
                void handleIncrementQuantity();
              }}
              type="button"
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <button
            className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-on-primary shadow-[0_14px_30px_-18px_rgba(157,70,11,0.55)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={disabled || busy}
            onClick={() => {
              void handleAddToCart();
            }}
            type="button"
          >
            {busy ? <LoaderCircle className="h-[18px] w-[18px] animate-spin" /> : <ShoppingBag size={18} />}
            {busy ? 'Adding...' : 'Add to Cart'}
          </button>
        )}
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-[60] w-[min(92vw,24rem)] -translate-x-1/2">
          <div className="pointer-events-auto animate-fadeInUp rounded-2xl border border-[#d9bfa8]/70 bg-white/95 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(112,56,18,0.45)] backdrop-blur-sm">
            <div className="flex items-start gap-3">
              {toast.imageUrl ? (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f7ead8]">
                  <Image alt={toast.productName} fill className="object-cover" src={toast.imageUrl} />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#4f1d0c]">Added: {toast.quantity} x {toast.productName}</p>
              </div>
              <button
                aria-label="Dismiss notification"
                className="text-[#8f350f] transition hover:text-[#6f2507]"
                onClick={() => setToast(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
