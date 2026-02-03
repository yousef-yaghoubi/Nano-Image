'use client';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../Auth/AuthButtons';
import { ModeToggle } from './ModeToggle';
import Logo from './Logo';
// import { useUser } from '@clerk/nextjs';
// import { getMediaQuery } from '@/lib/getMediaQuery';
// import { Suspense, use } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';

export default function Navbar({isAuthenticated}: {isAuthenticated: boolean}) {
  // Use a client-side hook instead of getMediaQuery in a client component
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // const { isSignedIn, user } = useUser();
  // console.log(isSignedIn);

  return (
    <div className="w-full h-20 border-b px-6 fixed top-0 z-70 bg-white/50 dark:bg-black/40 backdrop-blur-3xl">
      <div className="h-full flex justify-between items-center max-w-7xl mx-auto">
        <Logo />
        {isDesktop ? (
          <>
            <NavList isDesktop={true} />
            <div className="flex items-center gap-3">
              <AuthButtons isAuthenticated={isAuthenticated} />
              <LangSwicher />
              <ModeToggle />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <LangSwicher />
            <ModeToggle />

            <MobileMenu isAuthenticated={isAuthenticated} />
          </div>
        )}
      </div>
    </div>
  );
}
