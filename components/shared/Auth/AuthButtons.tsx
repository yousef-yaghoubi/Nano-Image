'use client';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ProfileIcon } from '../Navbar/ProfileIcon';
import { Button } from '@/components/ui/button';
import { User2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthButtons({
  isAuthenticated,
  mobile = false,
}: {
  isAuthenticated: boolean | undefined;
  mobile?: boolean;
}) {
  const t = useTranslations('Auth');

  if (isAuthenticated === undefined) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div
        className={cn('flex items-center gap-3', mobile && 'w-full flex-col')}
      >
        {!mobile ? (
          <div className="flex items-center gap-2">
            <ProfileIcon />
          </div>
        ) : (
          <Link href={'/profile'}>
            <Button>
              <User2 />
              ورود به حساب کاربری
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(mobile ? 'flex flex-col gap-2' : 'flex items-center gap-3')}
    >
      <ButtonSign className="bg-primary/10 flex h-10 items-center justify-center border-0">
        <SignUpButton>
          <span className="cursor-pointer">{t('signup')}</span>
        </SignUpButton>
      </ButtonSign>

      <ButtonSign className="flex h-10 items-center justify-center">
        <SignInButton>
          <span className="cursor-pointer">{t('signin')}</span>
        </SignInButton>
      </ButtonSign>
    </div>
  );
}

function ButtonSign({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-primary border-primary cursor-pointer rounded-md border px-3 py-1.5 text-sm font-bold whitespace-nowrap md:px-4 md:py-2 md:text-base',
        className
      )}
    >
      {children}
    </div>
  );
}
