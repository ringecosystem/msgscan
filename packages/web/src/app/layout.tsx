import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { APP_DESCRIPTION, APP_KEYWORDS, APP_NAME } from '@/config/site';
import { GlobalFont } from '@/config/font';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';
import AppProvider from '@/provider/AppProvider';

import type { Metadata, Viewport } from 'next';

import './globals.css';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: APP_NAME,
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME
  },
  formatDetection: {
    telephone: false
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: APP_NAME,
    description: APP_DESCRIPTION
  },
  icons: [
    {
      url: '/images/msgport32.png',
      sizes: '32x32',
      type: 'image/png',
      rel: 'icon'
    },
    {
      url: '/images/msgport48.png',
      sizes: '48x48',
      type: 'image/png',
      rel: 'icon'
    },
    {
      url: '/images/msgport96.png',
      sizes: '96x96',
      type: 'image/png',
      rel: 'icon'
    },
    {
      url: '/images/msgport192.png',
      sizes: '192x192',
      type: 'image/png',
      rel: 'icon'
    },
    {
      url: '/images/msgport512.png',
      sizes: '512x512',
      type: 'image/png',
      rel: 'icon'
    },
    {
      url: '/images/msgport167.png',
      sizes: '167x167',
      type: 'image/png',
      rel: 'apple-touch-icon'
    },
    {
      url: '/images/msgport180.png',
      sizes: '180x180',
      type: 'image/png',
      rel: 'apple-touch-icon'
    }
  ]
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#020817' }
  ]
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('min-h-dvh bg-background font-sans antialiased', GlobalFont.className)}
      >
        <NuqsAdapter>
          <AppProvider>
            <div className="flex min-h-dvh flex-col">
              <Header />
              <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-6 lg:px-8">
                {children}
              </main>
              <Footer />
            </div>
          </AppProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
