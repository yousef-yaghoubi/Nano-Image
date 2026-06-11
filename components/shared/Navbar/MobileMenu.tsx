import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import NavList from './Nav';
import { useParams } from 'next/navigation';
import AuthButtons from '../Auth/AuthButtons';
import { Skeleton } from '@/components/ui/skeleton';

export function MobileMenu({
  isAuthenticated,
}: {
  isAuthenticated: boolean | undefined;
  userEmail?: string;
}) {
  const params = useParams();
  const locale = params.locale;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className="cursor-pointer" />
      </SheetTrigger>

      <SheetContent
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        side={locale === 'en' ? 'left' : 'right'}
      >
        <SheetHeader>
          <SheetTitle className="border-b pb-4">
            <span className="shrink-0 text-2xl font-extrabold text-gray-600 lg:text-3xl dark:text-gray-100">
              Nano Image
            </span>
          </SheetTitle>

          <div className="flex h-[89dvh] flex-col justify-between">
            <NavList isDesktop={false} />

            {/* Auth */}
            <div className="flex w-full flex-col gap-3">
              {isAuthenticated === true ? (
                <>
                  <AuthButtons isAuthenticated={true} mobile />
                </>
              ) : isAuthenticated === false ? (
                <AuthButtons isAuthenticated={false} mobile />
              ) : (
                <Skeleton className="h-10 w-10 rounded-full" />
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
