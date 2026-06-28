import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import QueryProvider from './QueryProvider';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';
import { TooltipProvider } from '@/components/ui/tooltip';

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
              <Toaster position={locale == 'en' ? 'top-left' : 'top-right'} />
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
