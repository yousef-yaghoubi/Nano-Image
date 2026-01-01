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

  const changeLocale = (newLocale: string) => {
    return pathName.replace(/^\/(fa|en|ar)/, `/${newLocale}`);
  };

  return (
    <div>
      <DropdownMenu dir={params.locale === 'en' ? 'ltr' : 'rtl'}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Select locale"
            className="cursor-pointer h-10 w-10"
          >
            <Globe />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-32" align="start">
          <DropdownMenuItem asChild>
            <Link href={changeLocale('fa')} className="w-full cursor-pointer">
              <span>{t('fa')}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={changeLocale('en')} className="w-full cursor-pointer">
              <span>{t('en')}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={changeLocale('ar')} className="w-full cursor-pointer">
              <span>{t('ar')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
