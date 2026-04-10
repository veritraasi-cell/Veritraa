'use client';

import { useEffect } from 'react';

const RELOAD_KEY = 'veritraa-runtime-reset';

interface ClientRuntimeGuardProps {}

export default function ClientRuntimeGuard(_: Readonly<ClientRuntimeGuardProps>) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!isLocalhost) {
      return;
    }

    const resetRuntime = async () => {
      let hadServiceWorkers = false;

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length > 0) {
          hadServiceWorkers = true;
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
      }

      if ('caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
      }

      if (hadServiceWorkers && !window.sessionStorage.getItem(RELOAD_KEY)) {
        window.sessionStorage.setItem(RELOAD_KEY, '1');
        window.location.reload();
        return;
      }

      window.sessionStorage.removeItem(RELOAD_KEY);
    };

    void resetRuntime();
  }, []);

  return null;
}
