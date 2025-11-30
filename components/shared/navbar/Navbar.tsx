'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../AuthButtons';
import { ModeToggle } from '../ModeToggle';
import Logo from './Logo';

interface NavbarProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function Navbar({ isAuthenticated, userEmail }: NavbarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="w-full h-20 border-b px-6">
      <div className="h-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Logo />
        {isDesktop ? (
          <>
            <NavList isDesktop={true} />
            <div className="flex items-center gap-3">
              <AuthButtons
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
              />
              <LangSwicher />
              <ModeToggle />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <LangSwicher />
            <ModeToggle />

            <MobileMenu
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
            />
          </div>
        )}
      </div>
    </div>
  );
}
