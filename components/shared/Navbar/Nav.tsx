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
    <nav>
      <ul
        className={cn('flex gap-3 ', isDesktop ? 'flex-row' : ' flex-col mt-4')}
      >
        {navDetail.map((li) => {
          const CurrentIcon = li.icon;
          const isAcive = pathName == li.link;

          console.log(li.link, pathName);
          return (
            <li key={li.id}>
              <Link
                href={li.link}
                className={cn(
                  'flex gap-1 w-full px-2 py-4 rounded-sm',
                  isDesktop
                    ? isAcive
                      ? 'text-primary font-semibold text-sm lg:text-lg'
                      : 'font-medium text-sm lg:text-lg'
                    : isAcive
                      ? 'bg-primary/20 font-semibold text-primary'
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
    </nav>
  );
}

export default NavList;
