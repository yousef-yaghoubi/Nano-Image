import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import dynamic from 'next/dynamic';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import QueryProvider from './QueryProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import NextTopLoader from "nextjs-toploader"

const Toaster = dynamic(
  () => import('sonner').then((mod) => ({ default: mod.Toaster }))
);


function AllProviders({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <TooltipProvider>
              <Toaster
                position={locale == 'en' ? 'top-left' : 'top-right'}
                richColors
              />
              <NextTopLoader color="var(--primary)" showSpinner={false} />
              {children}
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}

export default AllProviders;
