import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import NavList from './Nav';
import AuthButtons from '../Auth/AuthButtons';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getLocale } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';

export async function MobileMenu() {
  const locale = await getLocale();
  const { isAuthenticated } = await auth();

  return (
    <Sheet>
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
        <div className="flex h-full flex-col justify-between">
          <NavList isDesktop={false} />

          {/* Auth */}
          <div className="absolute bottom-4 mt-4 flex w-full flex-col gap-3">
            {isAuthenticated === true ? (
              <>
                <AuthButtons mobile />
              </>
            ) : isAuthenticated === false ? (
              <AuthButtons mobile />
            ) : (
              <Skeleton className="h-10 w-10 rounded-full" />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
