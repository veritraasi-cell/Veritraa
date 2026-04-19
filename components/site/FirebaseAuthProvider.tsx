'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirebaseClientAuth,
  getFirebaseGoogleProvider,
  hasFirebaseClientConfig,
} from '@/lib/firebase/client';
import type { CustomerAccount } from '@/lib/auth/customer-auth';

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

type FirebaseAuthContextValue = {
  customer: CustomerAccount | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  authError: string | null;
  dialogOpen: boolean;
  dialogMode: 'login' | 'profile';
  authBusy: boolean;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
  signInWithGoogle: () => Promise<void>;
  savePhoneNumber: (phone: string) => Promise<void>;
  logout: () => Promise<void>;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

function stripFirebasePrefix(message: string) {
  return message.replace(/^Firebase:\s*/i, '').trim();
}

function getFriendlyCustomerAuthError(error: unknown) {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : null;
  const rawMessage =
    error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unable to continue with sign-in.';
  const message = stripFirebasePrefix(rawMessage);

  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return {
        message: null,
        keepDialogOpen: false,
      };
    case 'auth/popup-blocked':
      return {
        message: 'Your browser blocked the sign-in pop-up. Please allow pop-ups and try again.',
        keepDialogOpen: true,
      };
    case 'auth/network-request-failed':
      return {
        message: 'We could not reach the sign-in service. Check your internet connection and try again.',
        keepDialogOpen: true,
      };
    case 'auth/unauthorized-domain':
      return {
        message: 'This website is not yet authorized for customer sign-in.',
        keepDialogOpen: true,
      };
    case 'auth/operation-not-allowed':
      return {
        message: 'Google sign-in is not enabled for this project yet.',
        keepDialogOpen: true,
      };
    case 'auth/invalid-api-key':
      return {
        message: 'Customer sign-in is not configured correctly right now.',
        keepDialogOpen: true,
      };
    default:
      return {
        message: message || 'Unable to continue with sign-in.',
        keepDialogOpen: true,
      };
  }
}

async function readCustomerSession() {
  const response = await fetch('/api/customer/session', {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: {
      customer?: CustomerAccount;
    };
  };

  return payload.data?.customer ?? null;
}

function CustomerLoginDialog({
  open,
  mode,
  customer,
  authBusy,
  authError,
  onClose,
  onSignIn,
  onSavePhone,
}: Readonly<{
  open: boolean;
  mode: 'login' | 'profile';
  customer: CustomerAccount | null;
  authBusy: boolean;
  authError: string | null;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  onSavePhone: (phone: string) => Promise<void>;
}>) {
  const [phone, setPhone] = useState(customer?.phone ?? '');
  const clientConfigReady = hasFirebaseClientConfig();

  useEffect(() => {
    setPhone(customer?.phone ?? '');
  }, [customer?.phone, open, mode]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#120b07]/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-[#e5c7af] bg-[linear-gradient(180deg,#fff9f2,#fff2e4)] shadow-[0_24px_70px_-28px_rgba(82,28,4,0.6)]">
        <button
          aria-label="Close login dialog"
          className="absolute right-4 top-4 rounded-full border border-[#e5c7af] bg-white/90 p-2 text-[#7a2f07] transition hover:bg-white"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#99461e]">Customer account</p>
          <h2 className="mt-3 font-headline text-3xl text-[#1d1c18]">
            {mode === 'profile' ? 'Complete your account' : 'Sign in to continue'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#55433b]">
            {mode === 'profile'
              ? 'Add a mobile number so order updates and account activity stay tied to your profile.'
              : 'Sign in once to save your cart, post comments, and keep your activity linked to your account.'}
          </p>

          {!clientConfigReady ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Customer sign-in is unavailable right now. Please try again in a moment.
            </div>
          ) : null}

          {authError ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {authError}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {mode === 'profile' ? (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#4f1d0c]" htmlFor="customer-phone">
                  Mobile number
                </label>
                <input
                  id="customer-phone"
                  className="w-full rounded-2xl border border-[#dfc5ae] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#99461e]"
                  inputMode="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            ) : null}

            <button
              className="spice-gradient inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-18px_rgba(157,70,11,0.55)] transition disabled:cursor-not-allowed disabled:opacity-70"
              disabled={authBusy || !clientConfigReady || (mode === 'profile' && phone.trim().length < 6)}
              onClick={() => {
                if (mode === 'profile') {
                  void onSavePhone(phone);
                  return;
                }

                void onSignIn();
              }}
              type="button"
            >
              {authBusy ? 'Please wait...' : mode === 'profile' ? 'Save details' : 'Continue with Google'}
            </button>

            {mode === 'login' ? (
              <p className="text-center text-xs leading-5 text-[#7e5a4b]">
                A Google pop-up will open after you tap the button.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FirebaseAuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerAccount | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [authError, setAuthError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'login' | 'profile'>('login');
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const session = await readCustomerSession();

        if (cancelled) {
          return;
        }

        if (session) {
          setCustomer(session);
          setStatus('authenticated');
          setDialogMode(session.phone?.trim() ? 'login' : 'profile');
          setDialogOpen(false);
        } else {
          setCustomer(null);
          setStatus('unauthenticated');
          setDialogMode('login');
          setDialogOpen(false);
        }
      } catch (error) {
        if (!cancelled) {
          setAuthError(error instanceof Error ? error.message : 'Unable to load your account session.');
          setStatus('unauthenticated');
          setDialogMode('login');
          setDialogOpen(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  function openAuthDialog() {
    setAuthError(null);
    setDialogMode(customer?.phone?.trim() ? 'login' : customer ? 'profile' : 'login');
    setDialogOpen(true);
  }

  function closeAuthDialog() {
    setDialogOpen(false);
  }

  async function syncCustomerSession(idToken: string, phone?: string | null) {
    const response = await fetch('/api/customer/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken, phone }),
    });

    const payload = (await response.json()) as {
      success?: boolean;
      error?: { message?: string };
      data?: { customer?: CustomerAccount };
    };

    if (!response.ok || !payload.data?.customer) {
      throw new Error(payload.error?.message ?? 'Unable to sign you in.');
    }

    setCustomer(payload.data.customer);
    setStatus('authenticated');
    setDialogMode(payload.data.customer.phone?.trim() ? 'login' : 'profile');
    setDialogOpen(false);
    router.refresh();

    return payload.data.customer;
  }

  async function signInWithGoogle() {
    setAuthBusy(true);
    setAuthError(null);

    try {
      const auth = getFirebaseClientAuth();
      const provider = getFirebaseGoogleProvider();

      if (!auth || !provider) {
        throw new Error('Customer sign-in is unavailable right now.');
      }

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await syncCustomerSession(idToken, result.user.phoneNumber ?? null);
    } catch (error) {
      const authResult = getFriendlyCustomerAuthError(error);
      setAuthError(authResult.message);
      setDialogOpen(authResult.keepDialogOpen);
      setAuthBusy(false);
    }
  }

  async function savePhoneNumber(phone: string) {
    setAuthBusy(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/customer/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: { message?: string };
        data?: { customer?: CustomerAccount };
      };

      if (!response.ok || !payload.data?.customer) {
        throw new Error(payload.error?.message ?? 'Unable to save your mobile number.');
      }

      setCustomer(payload.data.customer);
      setStatus('authenticated');
      setDialogMode('login');
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to save your mobile number.');
      setDialogOpen(true);
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    setAuthBusy(true);
    setAuthError(null);

    try {
      const auth = getFirebaseClientAuth();

      if (auth) {
        await signOut(auth);
      }

      await fetch('/api/customer/logout', {
        method: 'POST',
      });

      setCustomer(null);
      setStatus('unauthenticated');
      setDialogMode('login');
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to log out.');
    } finally {
      setAuthBusy(false);
    }
  }

  const value: FirebaseAuthContextValue = {
    customer,
    status,
    isAuthenticated: status === 'authenticated' && Boolean(customer),
    authError,
    dialogOpen,
    dialogMode,
    authBusy,
    openAuthDialog,
    closeAuthDialog,
    signInWithGoogle,
    savePhoneNumber,
    logout,
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
      <CustomerLoginDialog
        authBusy={authBusy}
        authError={authError}
        customer={customer}
        mode={dialogMode}
        onClose={closeAuthDialog}
        onSavePhone={savePhoneNumber}
        onSignIn={signInWithGoogle}
        open={dialogOpen}
      />
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseCustomerAuth() {
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error('useFirebaseCustomerAuth must be used within a FirebaseAuthProvider.');
  }

  return context;
}
