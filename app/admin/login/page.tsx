'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@veritraa.in');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? 'Login failed.');
      }

      router.replace('/admin');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden bg-[linear-gradient(135deg,#fff8ef,#f7e0c4)]">
          <CardContent className="flex h-full flex-col justify-between gap-6 p-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-full bg-[#f4d8ba] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7a2f19]">
                Admin Login
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-white p-3 shadow-[0_14px_30px_-26px_rgba(63,28,16,0.45)]">
                  <Image src="/logo.png" alt="Veritraa" width={72} height={72} className="h-14 w-14 rounded-full object-cover" priority />
                </div>
                <div>
                  <CardTitle className="text-3xl leading-tight text-[#4b1f0f]">Veritraa Admin</CardTitle>
                  <CardDescription className="mt-2 max-w-lg text-base text-[#734f42]">
                    Sign in to the backend and operations center for products, orders, customers, shipping, and content.
                  </CardDescription>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Dashboard and live Shopify data',
                  'Product, order, and customer operations',
                  'Inventory, shipping, and CMS tools',
                  'Role-based admin access and audit logs',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-[#e6cdb3] bg-white/80 px-4 py-3 text-sm text-[#5c3d31]">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs leading-5 text-[#755245]">
              Demo credentials: <span className="font-semibold">admin@veritraa.in</span> / <span className="font-semibold">admin123456</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Use your admin credentials to access the control center.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@veritraa.in"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-[#6f4b3f]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-[#cfae8d] text-[#8a3a17]"
                />
                Remember me for 7 days
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7f5a4a]">Protected by session cookies and JWT auth.</span>
                <a href="/" className="font-semibold text-[#8a3a17] hover:underline">
                  View storefront
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
