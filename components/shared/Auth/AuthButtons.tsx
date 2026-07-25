import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { ProfileIcon } from '../Navbar/ProfileIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { getTranslations } from 'next-intl/server';
import { auth } from '@clerk/nextjs/server';

export default async function AuthButtons({
  mobile = false,
}: {
  mobile?: boolean;
}) {
  const t = await getTranslations('Auth');
  const { isAuthenticated } = await auth();

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
        <div className="flex w-full gap-2">
          <ProfileIcon showName={!!mobile} />
        </div>
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
