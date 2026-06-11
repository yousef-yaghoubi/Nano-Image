'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { getProfileMenuItems } from '@/lib/data';
import { useTranslations } from 'next-intl';
import { DrawerDialog } from '../../shared/DrawerDialog';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { MotionDiv, MotionSpan } from '@/components/shared/MotionWarpper';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : undefined;
  const navItems = getProfileMenuItems(locale ?? '');
  const t = useTranslations('Profile');

  return (
    <>
      <aside
        className="backgroundSecond sticky top-24 hidden h-fit w-full shrink-0 overflow-hidden rounded-3xl border border-gray-300 bg-linear-to-b shadow-xl md:w-64 lg:block dark:border-gray-700"
        style={{
          boxShadow:
            '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="relative flex flex-col items-center gap-4 border-b border-gray-200 p-5 dark:border-gray-800">
          <div className="relative">
            <div className="from-primary/50 relative h-28 w-28 rounded-full bg-linear-to-br to-cyan-600 p-1">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white dark:bg-gray-900">
                {isLoaded == false ? (
                  <Skeleton className="h-32 w-32 rounded-full" />
                ) : user?.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt="User Avatar"
                    className="h-full w-full rounded-full object-cover"
                    width={128}
                    height={128}
                  />
                ) : (
                  <User
                    size={64}
                    className="text-amber-600 dark:text-amber-400"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            {isLoaded == false ? (
              <Skeleton className="h-7 w-40" />
            ) : (
              <h3 className="mb-1 text-xl font-bold text-gray-800 dark:text-gray-100">
                {user?.fullName}
              </h3>
            )}
          </div>
        </div>

        <ul className="p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative mb-2 flex items-center gap-3 rounded-xl p-2 transition-all ${
                  isActive
                    ? 'from-primary/10 dark:from-primary/30 bg-linear-to-r to-cyan-50/80 text-cyan-500 shadow-inner dark:to-cyan-200/20'
                    : 'text-gray-600 hover:bg-gray-50/80 dark:text-gray-300 dark:hover:bg-gray-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <div
                    className={cn(
                      'primaryGradient absolute top-0 bottom-0 w-1.5',
                      locale == 'en'
                        ? 'left-0 rounded-r-lg'
                        : 'right-0 rounded-l-lg'
                    )}
                  />
                )}

                <div
                  className={`rounded-lg p-2 ${
                    isActive
                      ? 'from-primary/20 dark:from-primary/30 bg-linear-to-br to-cyan-200/20 dark:to-cyan-200/20'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  aria-hidden="true"
                >
                  <item.icon />
                </div>

                <span className="font-medium">{t(item.title)}</span>

                {isActive && (
                  <MotionDiv
                    className="m-auto"
                    animate={{ x: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {locale == 'en' ? (
                      <ChevronRight size={16} className="text-primary" />
                    ) : (
                      <ChevronLeft size={16} className="text-primary" />
                    )}
                  </MotionDiv>
                )}
              </Link>
            );
          })}
        </ul>

        <div className="relative flex justify-center px-5 py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative bg-white px-3 text-xs text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            {t('myAccount')}
          </div>
        </div>

        <div className="p-3">
          <div className="relative z-10 flex items-center gap-2">
            <DrawerDialog
              trigger={
                <div className="relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl border border-gray-200 bg-linear-to-r from-white to-gray-50 p-3 text-gray-700 transition-all hover:border-red-300 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:text-gray-200 dark:hover:border-red-500">
                  <LogOut size={16} />
                  {t('LogOut.logOut')}
                </div>
              }
              title={t('LogOut.title')}
            >
              <div className="mb-10 flex w-full justify-around gap-2 md:m-0">
                <SignOutButton>
                  <button className="bg-destructive/90 text-background w-1/3 cursor-pointer rounded-sm py-1 font-medium outline-none">
                    {t('LogOut.logOut')}
                  </button>
                </SignOutButton>
                <button className="text-destructive border-destructive w-1/3 cursor-pointer rounded-sm border py-1 font-medium outline-none">
                  {t('LogOut.no')}
                </button>
              </div>
            </DrawerDialog>
          </div>
        </div>
      </aside>

      <MotionDiv
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed right-0 bottom-0 left-0 z-50! flex w-full justify-around gap-1 border-t border-gray-200 bg-linear-to-t from-white/95 to-white/80 px-4 py-3 shadow-2xl backdrop-blur-lg lg:hidden dark:border-gray-800 dark:from-gray-900/95 dark:to-gray-900/80"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.link}
              href={item.link}
              className="relative flex h-14 w-16 flex-col items-center justify-center rounded-xl"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="z-10 flex flex-col items-center">
                <MotionDiv
                  className={`rounded-full p-1.5 ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  animate={{
                    rotate: isActive ? [0, 10, -10, 0] : 0,
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                >
                  <item.icon />
                </MotionDiv>

                <MotionSpan
                  className={`mt-0.5 text-xs font-medium ${
                    isActive
                      ? 'text-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  animate={{
                    y: isActive ? [0, -2, 0] : 0,
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.title}
                </MotionSpan>
              </div>

              {isActive && (
                <MotionDiv
                  layoutId="activeIndicator"
                  className="bg-primary absolute top-0 h-1 w-10 rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </MotionDiv>
    </>
  );
}
