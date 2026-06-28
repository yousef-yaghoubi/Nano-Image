'use client';

import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../Auth/AuthButtons';
import { ModeToggle } from './ModeToggle';
import Logo from './Logo';
import { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn } = useUser();
  return (
    <nav className="fixed top-0 z-70 h-20 w-full bg-white/50 px-6 backdrop-blur-3xl dark:bg-black/40">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
        <div className="hidden w-full items-center justify-around gap-2 md:flex">
          <Logo />
          <NavList isDesktop />
          <div className="flex items-center gap-3">
            <AuthButtons isAuthenticated={isSignedIn} />
            <LangSwicher />
            <ModeToggle />
          </div>
        </div>
        <div className="flex w-full items-center justify-between md:hidden">
          <div>
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            <LangSwicher />
            <ModeToggle />
            <Suspense>
              <MobileMenu isAuthenticated={isSignedIn} />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
