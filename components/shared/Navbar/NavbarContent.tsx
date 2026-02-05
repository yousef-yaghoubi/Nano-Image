'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
// import { MobileMenu } from './MobileMenu';
// import AuthButtons from '../Auth/AuthButtons';
import { ModeToggle } from './ModeToggle';
// import { useUser } from '@clerk/nextjs';

export function NavbarContent() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // const { isSignedIn, user } = useUser();
  // console.log(isSignedIn);

  return (
    <>
      {isDesktop ? (
        <>
          <NavList isDesktop={true} />
          <div className="flex items-center gap-3">
            {/* <AuthButtons isAuthenticated={!!isSignedIn} /> */}
            <LangSwicher />
            <ModeToggle />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <LangSwicher />
          <ModeToggle />

          {/* <MobileMenu isAuthenticated={!!isSignedIn} /> */}
        </div>
      )}
    </>
  );
}






