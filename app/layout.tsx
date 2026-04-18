import type { Metadata } from 'next';
import { Manrope, Noto_Serif } from 'next/font/google';
import './globals.css';
import ClientRuntimeGuard from '@/components/site/ClientRuntimeGuard';
import AppChrome from '@/components/site/AppChrome';

const headlineFont = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['400', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Veritraa | The Sensory Heritage',
  description:
    'Experience Veritraa through a refined storefront for heritage Indian masalas, exports, and store discovery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/veritra.png" />
      </head>
      <body
        className={`${headlineFont.variable} ${bodyFont.variable} bg-background font-body text-on-background antialiased`}
      >
        <ClientRuntimeGuard />
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
