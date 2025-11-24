'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ClockArrowDown,
  ClockArrowUp,
  SortDesc,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

interface SortDropdownProps {
  sortQuery: string;
  setSortQuery: (value: string) => void;
}

export function Sort({ sortQuery, setSortQuery }: SortDropdownProps) {
  const t = useTranslations('Filter.sorts');
  const tData = useTranslations('data');
  const SORT_OPTIONS = [
    { id: 1, title: t('likeDesc'), value: 'Like Desc', icon: ThumbsUp },
    { id: 2, title: t('likeAsc'), value: 'Like Asc', icon: ThumbsDown },
    { id: 3, title: t('dateDesc'), value: 'Date Desc', icon: ClockArrowDown },
    { id: 4, title: t('dateAsc'), value: 'Date Asc', icon: ClockArrowUp },
  ] as const;
  const params = useParams();
  const locale = params.locale;

  const currentSortOption = useMemo(
    () =>
      SORT_OPTIONS.find(
        (item) => item.value.toLowerCase() === sortQuery?.toLowerCase()
      ),
    [sortQuery]
  );
  const CurrentIcon = currentSortOption?.icon || SortDesc;
  const displaySortText = currentSortOption?.title || tData('sort');

  return (
    <DropdownMenu dir={locale == 'fa' ? 'rtl' : 'ltr'}>
      <DropdownMenuTrigger className="outline-none cursor-pointer" asChild>
        <button
          className="text-lg flex gap-2 items-center font-medium min-w-fit"
          aria-label="Sort options"
        >
          <CurrentIcon size={20} />
          {displaySortText}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuRadioGroup value={sortQuery} onValueChange={setSortQuery}>
          {SORT_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            return (
              <DropdownMenuRadioItem
                key={option.id}
                value={option.value}
                className="flex items-center justify-start gap-2"
              >
                <OptionIcon size={20} />
                {option.title}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
