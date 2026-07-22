import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getProfileMenuItems } from '@/lib/data';
import { SignOutButton, UserAvatar, useUser } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DrawerDialog = dynamic(
  () => import('../DrawerDialog').then((mod) => mod.DrawerDialog),
  { ssr: false, loading: () => <Skeleton className="h-8 w-full" /> }
);

const DropdownMenu = dynamic(
  () => import('@/components/ui/dropdown-menu').then((m) => m.DropdownMenu),
  { ssr: false , loading: () => <Skeleton className="h-7 w-7 rounded-full" />}
);

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';

export function ProfileIcon({ showName = false }: { showName?: boolean }) {
  const params = useParams() as { locale: string };
  const locale = params.locale;
  const ITEM_PROFILES = getProfileMenuItems(locale);
  const tProfile = useTranslations('Profile');
  const tAuth = useTranslations('Auth');
  const pathname = usePathname();
  const isActive = ITEM_PROFILES.find((item) => item.link === pathname);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  return (
    <DropdownMenu
      dir={params.locale === 'en' ? 'ltr' : 'rtl'}
      modal={false}
      open={openModal}
      onOpenChange={setOpenModal}
    >
      <DropdownMenuTrigger
        className={cn(
          'flex w-full cursor-pointer items-center gap-2 outline-none',
          isActive &&
            'border-primary ring-primary rounded-full border p-1 ring-1'
        )}
      >
        <UserAvatar fallback={<Skeleton className="h-7 w-7 rounded-full" />} />
        {showName && (
          <div className="flex flex-col items-start justify-start text-right">
            <span className="text-sm font-medium">{user?.firstName}</span>
            <span className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        )}
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
                <Button
                  variant={'destructive'}
                  onClick={() => setIsLoading(true)}
                  disabled={isLoading}
                  className="bg-destructive/90 text-background w-1/3 cursor-pointer rounded-sm py-1 font-medium outline-none"
                >
                  {isLoading ? (
                    <Loading classNameLoading="text-background" />
                  ) : (
                    tProfile('LogOut.logOut')
                  )}
                </Button>
              </SignOutButton>
              <Button
                variant={'outline'}
                className="min-w-24"
                onClick={() => {
                  setOpenModal(false);
                  setIsLoading(false);
                }}
              >
                {tProfile('LogOut.no')}
              </Button>
            </div>
          </DrawerDialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
