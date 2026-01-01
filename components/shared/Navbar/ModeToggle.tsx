'use client';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const themes = [
  { id: 1, title: 'light', icon: SunIcon },
  { id: 2, title: 'dark', icon: MoonIcon },
  { id: 3, title: 'system', icon: MonitorIcon },
];

export function ModeToggle() {
  const { setTheme, theme: activeTheme } = useTheme();
  const params = useParams();
  const locale = params.locale;
  const t = useTranslations('Theme');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = activeTheme || 'light';
  let CurrentIcon = SunIcon;

  if (currentTheme === 'system') {
    CurrentIcon = MonitorIcon;
  } else if (currentTheme === 'dark') {
    CurrentIcon = MoonIcon;
  } else if (currentTheme === 'light') {
    CurrentIcon = SunIcon;
  }

  return (
    <DropdownMenu dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer h-10 w-10"
        >
          <CurrentIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.title)}
            className={cn(
              currentTheme === theme.title ? 'font-bold text-primary' : '',
              'cursor-pointer'
            )}
          >
            <theme.icon
              className={cn(
                'mr-2 h-4 w-4',
                currentTheme === theme.title ? 'text-primary' : ''
              )}
            />
            {t(theme.title)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
