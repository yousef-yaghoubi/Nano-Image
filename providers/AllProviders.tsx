import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <NextIntlClientProvider>
          <Toaster position="top-right" />
          <NextTopLoader color="var(--primary)" showSpinner={false} />
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default AllProviders;
