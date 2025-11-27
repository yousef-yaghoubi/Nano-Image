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
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function LangSwicher() {
  const t = useTranslations('Languages');
  const params = useParams();
  console.log(params.locale);

  return (
    <div>
      <DropdownMenu dir={params.locale == 'fa' ? 'rtl' : 'ltr'}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Select theme">
            <Globe />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-32" align='start'>
          <DropdownMenuItem>
            <Link href={'/fa'} className="w-full">
              <span>{t('fa')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={'/en'} className="w-full">
              <span>{t('en')}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
