import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { SignOutButton, UserAvatar } from '@clerk/nextjs';
import { Heart, LogOut, Plus, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { DrawerDialog } from '../DrawerDialog';

export function ProfileIcon({ children }: { children?: React.ReactNode }) {
  const params = useParams() as { locale: string };
  const locale = params.locale;
  const ITEM_PROFILES = [
    { id: 1, title: 'profile', link: `/${locale}/profile`, icon: User },
    {
      id: 2,
      title: 'myFavorites',
      link: `/${locale}/myFavorites`,
      icon: Heart,
    },
    { id: 3, title: 'myPrompts', link: `/${locale}/myPrompts`, icon: Plus },
  ];
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const pathname = usePathname();
  const isActive = ITEM_PROFILES.find((item) => item.link === pathname);
  console.log('isActive', isActive);
  console.log('pathname', pathname);
  return (
    <DropdownMenu dir={params.locale == 'fa' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger
        className={cn(
          'outline-none cursor-pointer flex gap-2 items-center',
          isActive &&
            'border border-primary ring-1 ring-primary p-1 rounded-full'
        )}
      >
        <UserAvatar />
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{tProfile('myAccount')}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {ITEM_PROFILES.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={cn(
                'w-full',
                isActive?.link == item.link && 'bg-primary/10'
              )}
            >
              <Link
                href={item.link}
                className="w-full h-full flex items-center gap-2"
              >
                {item.icon && <item.icon />}
                {tProfile(item.title)}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <DrawerDialog
            trigger={
              <div className="w-full h-full flex items-center gap-2 text-sm text-destructive hover:bg-destructive/10 py-1.5 px-2 cursor-pointer rounded-sm">
                <LogOut size={16} />
                {tAuth('signout')}
              </div>
            }
            title={tProfile('LogOut.title')}
          >
            <div className="w-full flex gap-2 justify-around mb-10 md:m-0">
              <SignOutButton>
                <button className="w-1/3 cursor-pointer bg-destructive/90 text-background py-1 rounded-sm">
                  خروج
                </button>
              </SignOutButton>
              <button className="w-1/3 cursor-pointer py-1 rounded-sm text-destructive border border-destructive">
                خیر
              </button>
            </div>
          </DrawerDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
