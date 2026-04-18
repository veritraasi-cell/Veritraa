'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/site/CartProvider';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';

export default function AddToCartButton({
  merchandiseId,
  disabled = false,
}: Readonly<{
  merchandiseId: string;
  disabled?: boolean;
}>) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { openAuthDialog } = useFirebaseCustomerAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAddToCart() {
    setBusy(true);
    setMessage(null);

    try {
      await addToCart(merchandiseId, 1);
      setMessage('Added to cart.');
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('log in')) {
        openAuthDialog();
      }

      setMessage(error instanceof Error ? error.message : 'Unable to add this item right now.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="spice-gradient inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-on-primary shadow-[0_14px_30px_-18px_rgba(157,70,11,0.55)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={disabled || busy}
        onClick={() => {
          void handleAddToCart();
        }}
        type="button"
      >
        <ShoppingBag size={18} />
        {busy ? 'Adding...' : 'Add to cart'}
      </button>
      {message ? <p className="text-sm text-[#6a4637]">{message}</p> : null}
    </div>
  );
}
