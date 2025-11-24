'use client'
import {
  SignOutButton,
  SignInButton,
  SignUpButton,
  UserAvatar,
} from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function AuthButtons({
  isAuthenticated,
  userEmail,
  mobile = false,
}: {
  isAuthenticated: boolean;
  userEmail?: string;
  mobile?: boolean;
}) {
  const t = useTranslations("Auth")

  if (isAuthenticated) {
    return (
      <div
        className={cn('flex items-center gap-3', mobile && 'flex-col w-full')}
      >
        {!mobile && (
          <div className="flex items-center gap-2">
            <UserAvatar />
            {userEmail && (
              <span className="hidden lg:flex max-w-[200px] truncate">
                {userEmail}
              </span>
            )}
          </div>
        )}

        <ButtonSign>
          <SignOutButton>
            <span className="cursor-pointer">{t("signout")}</span>
          </SignOutButton>
        </ButtonSign>
      </div>
    );
  }

  return (
    <div
      className={cn(mobile ? 'flex flex-col gap-2' : 'flex items-center gap-3')}
    >
      <ButtonSign className="h-10 flex justify-center items-center border-0 bg-primary/10">
        <SignUpButton>
          <span className="cursor-pointer">{t("signup")}</span>
        </SignUpButton>
      </ButtonSign>

      <ButtonSign className="h-10 flex justify-center items-center">
        <SignInButton>
          <span className="cursor-pointer">{t("signin")}</span>
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
