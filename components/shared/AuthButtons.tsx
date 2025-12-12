'use client';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ProfileIcon } from './navbar/ProfileIcon';

export default function AuthButtons({
  isAuthenticated,
  mobile = false,
  userEmail,
}: {
  isAuthenticated: boolean;
  mobile?: boolean;
  userEmail?: string;
}) {
  const t = useTranslations('Auth');

  if (isAuthenticated) {
    return (
      <div
        className={cn('flex items-center gap-3', mobile && 'flex-col w-full')}
      >
        {!mobile ? (
          <div className="flex items-center gap-2">
            <ProfileIcon />
          </div>
        ) : (
          <div className="">
            <ProfileIcon>{userEmail}</ProfileIcon>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(mobile ? 'flex flex-col gap-2' : 'flex items-center gap-3')}
    >
      <ButtonSign className="h-10 flex justify-center items-center border-0 bg-primary/10">
        <SignUpButton>
          <span className="cursor-pointer">{t('signup')}</span>
        </SignUpButton>
      </ButtonSign>

      <ButtonSign className="h-10 flex justify-center items-center">
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
        'border text-primary font-bold border-primary px-3 py-1.5 md:px-4 md:py-2 cursor-pointer rounded-md text-sm md:text-base whitespace-nowrap',
        className
      )}
    >
      {children}
    </div>
  );
}
