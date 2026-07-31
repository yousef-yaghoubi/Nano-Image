'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import NavList from './Nav';
import { ProfileIcon } from './ProfileIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function MobileMenuClient({
  locale,
  isAuthenticated,
}: {
  locale: string;
  isAuthenticated: boolean | null;
}) {
  const [open, setOpen] = useState(false);
  const closeNav = useCallback(() => setOpen(false), []);
  const t = useTranslations('Auth');

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          aria-label="Open menu"
        >
          <MenuIcon className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        side={locale === 'en' ? 'left' : 'right'}
        className="z-100 p-4"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="border-b p-0 pb-2">
            <div>
              <span className="shrink-0 text-2xl font-extrabold text-gray-600 lg:text-3xl dark:text-gray-100">
                Nano Image
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="relative flex h-full flex-col justify-between">
          <NavList isDesktop={false} onLinkClick={closeNav} />

          <div className="absolute bottom-4 flex w-full flex-col">
            {isAuthenticated === true ? (
              <ProfileIcon showName closeSheet={closeNav} />
            ) : isAuthenticated === false ? (
              <div className="flex flex-col gap-2">
                <div
                  onClick={closeNav}
                  className={cn(
                    'text-primary border-primary bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 py-1.5 text-sm font-bold whitespace-nowrap md:px-4 md:py-2 md:text-base'
                  )}
                >
                  <SignUpButton>
                    <span className="cursor-pointer">{t('signup')}</span>
                  </SignUpButton>
                </div>
                <div
                  onClick={closeNav}
                  className={cn(
                    'text-primary border-primary flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 py-1.5 text-sm font-bold whitespace-nowrap md:px-4 md:py-2 md:text-base'
                  )}
                >
                  <SignInButton>
                    <span className="cursor-pointer">{t('signin')}</span>
                  </SignInButton>
                </div>
              </div>
            ) : (
              <Skeleton className="h-10 w-10 rounded-full" />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
