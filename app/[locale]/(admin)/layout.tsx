import type { Metadata } from 'next';
import { SidebarProvider } from '@/context/SidebarContext';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { sessionClaims } = await auth();
  const { locale } = await params;

  const role = (
    sessionClaims?.public_metadata as SessionPublicMetadata | undefined
  )?.role;

  if (!role || role === 'MEMBER') {
    redirect(`/${locale}`);
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}

export default layout;
