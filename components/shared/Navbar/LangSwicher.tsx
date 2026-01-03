'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LangSwicher() {
  const t = useTranslations('Languages');
  const params = useParams();
  const pathName = usePathname();
  const activeLocale = params.locale;

  const changeLocale = (newLocale: string) => {
    return pathName.replace(/^\/(fa|en|ar)/, `/${newLocale}`);
  };

  return (
    <div>
      <DropdownMenu dir={activeLocale === 'en' ? 'ltr' : 'rtl'}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Select locale"
            className="cursor-pointer h-10 w-10  bg-white/50 dark:bg-transparent"
          >
            <Globe />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-32 z-100" align="start">
          <DropdownMenuItem asChild>
            <Link href={changeLocale('fa')} className="w-full cursor-pointer">
              <span
                className={
                  activeLocale === 'fa' ? 'text-primary font-bold' : undefined
                }
              >
                {t('fa')}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={changeLocale('en')} className="w-full cursor-pointer">
              <span
                className={
                  activeLocale === 'en' ? 'text-primary font-bold' : undefined
                }
              >
                {t('en')}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={changeLocale('ar')} className="w-full cursor-pointer">
              <span
                className={
                  activeLocale === 'ar' ? 'text-primary font-bold' : undefined
                }
              >
                {t('ar')}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
