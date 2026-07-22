import type { Metadata, Viewport } from 'next';
import './globals.css';
import localFont from 'next/font/local';
import AllProviders from '@/providers/AllProviders';
import { Suspense } from 'react';
import { routing } from '@/i18n/routing';

const yekanBakh = localFont({
  src: [
    {
      path: './font/YekanBakh-ExtraBlack.ttf',
      weight: '900',
    },
    {
      path: './font/YekanBakh-Black.ttf',
      weight: '800',
    },
    {
      path: './font/YekanBakh-ExtraBold.ttf',
      weight: '700',
    },
    {
      path: './font/YekanBakh-Bold.ttf',
      weight: '600',
    },
    {
      path: './font/YekanBakh-SemiBold.ttf',
      weight: '500',
    },
    {
      path: './font/YekanBakh-Regular.ttf',
      weight: '400',
    },
    {
      path: './font/YekanBakh-Light.ttf',
      weight: '300',
    },
  ],
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const ogImage = `${baseUrl}/images/slide1.webp`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    template: '%s | Nano Image',
    default: 'Nano Image',
  },
  description:
    'Discover and share AI image prompts. Browse thousands of creative prompts for AI image generation.',
  alternates: {
    canonical: baseUrl,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((locale) => [locale, `${baseUrl}/${locale}`])
      ),
      'x-default': `${baseUrl}/${routing.defaultLocale}`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'Nano Image',
    title: 'Nano Image',
    description:
      'Discover and share AI image prompts. Browse thousands of creative prompts for AI image generation.',
    url: baseUrl,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Nano Image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nano Image',
    description:
      'Discover and share AI image prompts. Browse thousands of creative prompts for AI image generation.',
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fa' }, { locale: 'ar' }];
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}>) {
  const { locale } = await params;

  return (
    <Suspense>
      <html
        lang={locale}
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        suppressHydrationWarning
        className="selection:bg-primary/10"
      >
        <body className={`${yekanBakh.className} antialiased`}>
          <AllProviders locale={locale}>{children}</AllProviders>
        </body>
      </html>
    </Suspense>
  );
}
