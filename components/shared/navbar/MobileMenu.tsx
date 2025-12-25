import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import NavList from './Nav';
import AuthButtons from '../AuthButtons';
import { useParams } from 'next/navigation';

export function MobileMenu({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
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
            <span className="text-2xl lg:text-3xl font-extrabold text-gray-600 dark:text-gray-100 shrink-0">
              Nano Image
            </span>
          </SheetTitle>

          <div className="h-[89dvh] flex flex-col justify-between">
            <NavList isDesktop={false} />

            {/* Auth */}
            <div className="w-full flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <AuthButtons isAuthenticated={true} mobile userEmail={userEmail} />
                </>
              ) : (
                <AuthButtons isAuthenticated={false} mobile />
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
