import type { Metadata } from 'next';
import { Manrope, Noto_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/site/Navbar';
import SiteFooter from '@/components/site/SiteFooter';
import ClientRuntimeGuard from '@/components/site/ClientRuntimeGuard';

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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
        className={`${headlineFont.variable} ${bodyFont.variable} bg-background font-body text-on-background antialiased`}
      >
        <ClientRuntimeGuard />
        <Navbar />
        <main className="content-frame min-h-screen pt-[72px] sm:pt-[78px] md:pt-[92px]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
