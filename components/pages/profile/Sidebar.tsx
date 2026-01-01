'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LogOut, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import {
  MotionAside,
  MotionDiv,
  MotionH3,
  MotionNav,
  MotionSpan,
} from '../../shared/MotionWarpper';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { getProfileMenuItems } from '@/lib/data';
import { useTranslations } from 'next-intl';
import { DrawerDialog } from '../../shared/DrawerDialog';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : undefined;
  const navItems = getProfileMenuItems(locale ?? '');
  const t = useTranslations('Profile');

  return (
    <>
      <MotionAside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="hidden md:block w-full md:w-64 shrink-0 rounded-3xl border border-gray-300 dark:border-gray-700 shadow-xl h-fit sticky top-24 bg-linear-to-b  backgroundSecond overflow-hidden"
        style={{
          boxShadow:
            '0 10px 30px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="relative p-5 flex flex-col items-center gap-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <div className="relative w-28 h-28 rounded-full bg-linear-to-br from-primary/50 to-cyan-600 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <Image
                    src={user?.imageUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
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
            <MotionH3
              className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {user?.fullName}
            </MotionH3>
          </div>
        </div>

        <ul className="p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`relative flex items-center gap-3 p-2 rounded-xl mb-2 transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-primary/10 to-cyan-50/80 dark:from-primary/30 dark:to-cyan-200/20 text-cyan-500 shadow-inner'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <MotionDiv
                    className={cn(
                      'absolute top-0 bottom-0 w-1.5 primaryGradient',
                      locale == 'en'
                        ? 'left-0 rounded-r-lg'
                        : 'right-0 rounded-l-lg'
                    )}
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-linear-to-br from-primary/20 to-cyan-200/20 dark:from-primary/30 dark:to-cyan-200/20'
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

        <div className="relative px-5 py-2 flex justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative bg-white dark:bg-gray-900 px-3 text-xs text-gray-500 dark:text-gray-400">
            {t('myAccount')}
          </div>
        </div>

        <div className="p-3">
          <div className="relative z-10 flex items-center gap-2">
            <DrawerDialog
              trigger={
                <div className="w-full flex items-center justify-center cursor-pointer gap-2 p-3 text-gray-700 dark:text-gray-200 rounded-xl bg-linear-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-500 transition-all relative overflow-hidden">
                  <LogOut size={16} />
                  {t('LogOut.logOut')}
                </div>
              }
              title={t('LogOut.title')}
            >
              <div className="w-full flex gap-2 justify-around mb-10 md:m-0">
                <SignOutButton>
                  <button className="w-1/3 outline-none font-medium cursor-pointer bg-destructive/90 text-background py-1 rounded-sm">
                    {t('LogOut.logOut')}
                  </button>
                </SignOutButton>
                <button className="w-1/3 outline-none font-medium cursor-pointer py-1 rounded-sm text-destructive border border-destructive">
                  {t('LogOut.no')}
                </button>
              </div>
            </DrawerDialog>
          </div>
        </div>
      </MotionAside>

      <MotionNav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="md:hidden w-full px-4 py-3 bg-linear-to-t from-white/95 to-white/80 dark:from-gray-900/95 dark:to-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-around gap-1 fixed bottom-0 left-0 right-0 z-50! shadow-2xl"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.link}
              href={item.link}
              className="relative flex flex-col items-center justify-center w-16 h-14 rounded-xl"
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="z-10 flex flex-col items-center">
                <MotionDiv
                  className={`p-1.5 rounded-full ${
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
                  className={`text-xs mt-0.5 font-medium ${
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
                  className="absolute top-0 w-10 h-1 bg-primary rounded-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </MotionNav>
    </>
  );
}
