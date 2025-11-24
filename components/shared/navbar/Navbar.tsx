'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import NavList from './Nav';
import LangSwicher from './LangSwicher';
import { MobileMenu } from './MobileMenu';
import AuthButtons from '../AuthButtons';

interface NavbarProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function Navbar({ isAuthenticated, userEmail }: NavbarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div className="w-full h-20 border-b border-gray-200 px-6">
      <div className="h-full flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <span className="text-2xl lg:text-3xl font-extrabold text-gray-600 shrink-0">
          Nano Image
        </span>
        {isDesktop ? (
          <>
            <NavList isDesktop={true} />
            <div className="flex items-center gap-3">
              <AuthButtons
                isAuthenticated={isAuthenticated}
                userEmail={userEmail}
              />
              <LangSwicher />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center gap-2">
            <LangSwicher />
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
