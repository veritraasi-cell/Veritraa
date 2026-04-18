'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { StorefrontCart } from '@/components/site/cart-types';
import { useFirebaseCustomerAuth } from '@/components/site/FirebaseAuthProvider';

const CART_STORAGE_KEY = 'veritraa-shopify-cart-id';

type CartContextValue = {
  cart: StorefrontCart | null;
  cartId: string | null;
  isLoading: boolean;
  error: string | null;
  addToCart: (merchandiseId: string, quantity?: number) => Promise<StorefrontCart | null>;
  updateLineQuantity: (lineId: string, quantity: number) => Promise<StorefrontCart | null>;
  removeLine: (lineId: string) => Promise<StorefrontCart | null>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function callCartApi<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json()) as { ok: boolean; data?: T; error?: string };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error ?? 'Cart request failed.');
  }

  return payload.data as T;
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [cart, setCart] = useState<StorefrontCart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, openAuthDialog, status } = useFirebaseCustomerAuth();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (!isAuthenticated) {
      setCart(null);
      setCartId(null);
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    const storedCartId = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCartId) {
      return;
    }

    setCartId(storedCartId);
  }, [isAuthenticated, status]);

  useEffect(() => {
    if (!cartId) {
      setCart(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await callCartApi<{ cart: StorefrontCart | null }>(`/api/cart?cartId=${encodeURIComponent(cartId)}`);

        if (cancelled) {
          return;
        }

        if (!data.cart) {
          window.localStorage.removeItem(CART_STORAGE_KEY);
          setCartId(null);
          setCart(null);
          return;
        }

        setCart(data.cart);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load cart.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [cartId]);

  function persistCart(nextCart: StorefrontCart | null) {
    setCart(nextCart);

    if (!nextCart) {
      setCartId(null);
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    setCartId(nextCart.id);
    window.localStorage.setItem(CART_STORAGE_KEY, nextCart.id);
    return nextCart;
  }

  async function addToCart(merchandiseId: string, quantity = 1) {
    if (!isAuthenticated) {
      openAuthDialog();
      throw new Error('Please log in before shopping.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await callCartApi<{ cart: StorefrontCart | null }>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          action: 'add',
          cartId,
          merchandiseId,
          quantity,
        }),
      });

      return persistCart(data.cart);
    } catch (addError) {
      const message = addError instanceof Error ? addError.message : 'Unable to add item to cart.';
      setError(message);
      throw addError;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateLineQuantity(lineId: string, quantity: number) {
    if (!cartId) {
      return null;
    }

    if (!isAuthenticated) {
      openAuthDialog();
      throw new Error('Please log in before shopping.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await callCartApi<{ cart: StorefrontCart | null }>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          action: 'update-line',
          cartId,
          lineId,
          quantity,
        }),
      });

      return persistCart(data.cart);
    } catch (updateError) {
      const message = updateError instanceof Error ? updateError.message : 'Unable to update cart line.';
      setError(message);
      throw updateError;
    } finally {
      setIsLoading(false);
    }
  }

  async function removeLine(lineId: string) {
    if (!cartId) {
      return null;
    }

    if (!isAuthenticated) {
      openAuthDialog();
      throw new Error('Please log in before shopping.');
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await callCartApi<{ cart: StorefrontCart | null }>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          action: 'remove-line',
          cartId,
          lineId,
        }),
      });

      return persistCart(data.cart);
    } catch (removeError) {
      const message = removeError instanceof Error ? removeError.message : 'Unable to remove cart line.';
      setError(message);
      throw removeError;
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshCart() {
    if (!cartId) {
      setCart(null);
      return;
    }

    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await callCartApi<{ cart: StorefrontCart | null }>(`/api/cart?cartId=${encodeURIComponent(cartId)}`);
      persistCart(data.cart);
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to refresh cart.');
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    cart,
    cartId,
    isLoading,
    error,
    addToCart,
    updateLineQuantity,
    removeLine,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }

  return context;
}
