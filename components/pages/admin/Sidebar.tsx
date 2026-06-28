'use client';

import { MotionLi } from '@/components/shared/MotionWarpper';
import LangSwicher from '@/components/shared/Navbar/LangSwicher';
import Logo from '@/components/shared/Navbar/Logo';
import { ModeToggle } from '@/components/shared/Navbar/ModeToggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/context/SidebarContext';
import { cn } from '@/lib/utils';
import {
  Files,
  PanelLeft,
  PanelRight,
  Undo2,
  UsersRound,
  X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  {
    id: 1,
    title: 'users',
    href: '/admin/users',
    icon: UsersRound,
  },
  {
    id: 2,
    title: 'prompts',
    href: '/admin/prompts',
    icon: Files,
  },
  {
    id: 3,
    title: 'back',
    href: '/',
    icon: Undo2,
  },
];

export default function Sidebar() {
  const tAdmin = useTranslations('Pages.Admin');
  const pathname = usePathname();
  const locale = useLocale();

  const {
    isExpanded,
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    isMobile,
  } = useSidebar();

  
  const showContent = isExpanded || isMobileOpen;

  const handleToggle = () => {
    if (isMobile) {
      toggleMobileSidebar();
      return;
    }

    toggleSidebar();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        className={cn(
          'bg-background fixed inset-y-0 z-50 flex h-screen flex-col justify-between overflow-y-hidden transition-[left,right,width] duration-200 ease-linear',

          locale == 'en' ? 'rounded-r-2xl border-r' : 'rounded-l-2xl border-l',
          // Desktop
          !isMobileOpen && (isExpanded ? 'w-80 p-5' : 'w-20 p-3'),

          // Mobile Drawer
          isMobileOpen &&
            cn(
              'fixed w-80 p-5 shadow-xl',
              locale == 'en' ? 'left-0' : 'right-0'
            )
        )}
      >
        <div>
          {/* Header */}
          <div
            className={cn(
              'mb-6 flex items-center',
              showContent
                ? 'justify-between'
                : 'flex-col-reverse justify-center gap-2'
            )}
          >
            <Logo  />

            <Button variant="outline" size="icon" onClick={handleToggle}>
              {isMobileOpen ? (
                <X size={20} />
              ) : locale == 'en' ? (
                <PanelLeft size={20} color="#00b487" />
              ) : (
                <PanelRight size={20} />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <ul className="space-y-2">
            {LINKS.map((item) => {
              const active = pathname.replace(`/${locale}`, '') === item.href;

              const Icon = item.icon;

              return (
                <MotionLi
                  key={item.id}
                  whileHover={{
                    x: locale === 'en' ? 5 : -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (isMobileOpen) {
                        toggleMobileSidebar();
                      }
                    }}
                    className={cn(
                      'flex items-center rounded-xl p-3 transition-all duration-200',

                      showContent ? 'gap-3' : 'justify-center',

                      active
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent hover:bg-accent/70'
                    )}
                  >
                    <Icon size={24} className="shrink-0" />

                    {showContent && (
                      <span className="truncate">
                        {tAdmin(`${item.title}.${item.title}`)}
                      </span>
                    )}
                  </Link>
                </MotionLi>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div
          className={cn(
            'flex',
            showContent ? 'justify-center gap-2' : 'flex-col items-center gap-3'
          )}
        >
          <LangSwicher />
          <ModeToggle />
        </div>
      </aside>
    </>
  );
}
