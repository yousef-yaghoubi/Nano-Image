'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../Auth/AuthButtons';
import { ModeToggle } from './ModeToggle';
import Logo from './Logo';

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

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
