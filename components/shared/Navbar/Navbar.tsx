'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../Auth/AuthButtons';
import { ModeToggle } from './ModeToggle';
import Logo from './Logo';
import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Navbar() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { isSignedIn } = useUser();
  return (
    <div className="fixed top-0 z-70 h-20 w-full border-b bg-white/50 px-6 backdrop-blur-3xl dark:bg-black/40">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <Logo />
        {isDesktop ? (
          <>
            <NavList isDesktop={true} />
            <div className="flex items-center gap-3">
              <AuthButtons isAuthenticated={isSignedIn} />
              <LangSwicher />
              <ModeToggle />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <LangSwicher />
            <ModeToggle />
            <Suspense>
              <MobileMenu isAuthenticated={isSignedIn} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
