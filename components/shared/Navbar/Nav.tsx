'use client';
import { cn } from '@/lib/utils';
import { House, PlusIcon, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavList({ isDesktop }: { isDesktop: boolean }) {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const navDetail = [
    { id: 1, label: t('home'), link: `/${locale}`, icon: House },
    { id: 2, label: t('prompts'), link: `/${locale}/prompts`, icon: Users },
    {
      id: 4,
      label: t('newPrompt'),
      link: `/${locale}/newPrompt`,
      icon: PlusIcon,
    },
  ];
  const pathName = usePathname();

  return (
    <div>
      <ul
        className={cn('flex gap-3', isDesktop ? 'flex-row' : 'mt-4 flex-col')}
      >
        {navDetail.map((li) => {
          const CurrentIcon = li.icon;
          const isAcive = pathName == li.link;

          return (
            <li key={li.id}>
              <Link
                href={li.link}
                className={cn(
                  'flex w-full gap-1 rounded-sm px-2 py-4',
                  isDesktop
                    ? isAcive
                      ? 'text-primary text-sm font-semibold lg:text-lg'
                      : 'text-sm font-medium lg:text-lg'
                    : isAcive
                      ? 'bg-primary/20 text-primary font-semibold'
                      : 'bg-primary/5 font-light'
                )}
              >
                {CurrentIcon && !isDesktop && <CurrentIcon />}
                <span>{li.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default NavList;
