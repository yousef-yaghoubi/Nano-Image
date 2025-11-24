'use client';
import { cn } from '@/lib/utils';
import { Heart, House, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavList({ isDesktop }: { isDesktop: boolean }) {
  const t = useTranslations('Navbar');
  const navDetail = [
    { id: 1, label: t('home'), link: '/', icon: House },
    { id: 2, label: t('favorite'), link: '/favorites', icon: Heart },
    { id: 3, label: t('about'), link: '/about', icon: Users },
  ];
  const pathName = usePathname();

  return (
    <nav>
      <ul
        className={cn('flex gap-3 mt-4', isDesktop ? 'flex-row' : ' flex-col')}
      >
        {navDetail.map((li) => {
          const CurrentIcon = li.icon;
          const isAcive = pathName == li.link;
          return (
            <li key={li.id}>
              <Link
                href={li.link}
                className={cn(
                  'flex gap-1 w-full px-2 py-4 rounded-sm',
                  isDesktop
                    ? isAcive
                      ? 'text-primary font-semibold'
                      : 'font-medium'
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
