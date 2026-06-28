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
import { getProfileMenuItems } from '@/lib/data';
import { SignOutButton, UserAvatar } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { DrawerDialog } from '../DrawerDialog';

export function ProfileIcon({ children }: { children?: React.ReactNode }) {
  const params = useParams() as { locale: string };
  const locale = params.locale;
  const ITEM_PROFILES = getProfileMenuItems(locale);
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const pathname = usePathname();
  const isActive = ITEM_PROFILES.find((item) => item.link === pathname);

  return (
    <DropdownMenu dir={params.locale === 'en' ? 'ltr' : 'rtl'} modal={false}>
      <DropdownMenuTrigger
        className={cn(
          'flex cursor-pointer items-center gap-2 outline-none',
          isActive &&
            'border-primary ring-primary rounded-full border p-1 ring-1'
        )}
      >
        <UserAvatar />
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-100 w-56" align="start">
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
                className="flex h-full w-full items-center gap-2"
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
              <div className="text-destructive hover:bg-destructive/10 flex h-full w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
                <LogOut size={16} />
                {tAuth('signout')}
              </div>
            }
            title={tProfile('LogOut.title')}
          >
            <div className="mb-10 flex w-full justify-around gap-2 md:m-0">
              <SignOutButton>
                <button className="bg-destructive/90 text-background w-1/3 cursor-pointer rounded-sm py-1 font-medium outline-none">
                  {tProfile('LogOut.logOut')}
                </button>
              </SignOutButton>
              <button className="text-destructive border-destructive w-1/3 cursor-pointer rounded-sm border py-1 font-medium outline-none">
                {tProfile('LogOut.no')}
              </button>
            </div>
          </DrawerDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
