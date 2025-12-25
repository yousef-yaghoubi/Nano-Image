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
  
  const SORT_OPTIONS = [
    { id: 1, title: t('likeDesc'), value: 'likes desc', icon: ThumbsUp },
    { id: 2, title: t('likeAsc'), value: 'likes asc', icon: ThumbsDown },
    { id: 3, title: t('dateDesc'), value: 'date desc', icon: ClockArrowDown },
    { id: 4, title: t('dateAsc'), value: 'date asc', icon: ClockArrowUp },
  ] as const;
  const params = useParams();
  const locale = params.locale;

  const currentSortOption =
    useMemo(
      () =>
        SORT_OPTIONS.find(
          (item) => item.value.toLowerCase() === sortQuery?.toLowerCase()
        ),
      [sortQuery]
    );
  const CurrentIcon = currentSortOption?.icon || SORT_OPTIONS[0].icon;
  const displaySortText = currentSortOption?.title || t('likeDesc');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer" asChild>
        <button
          className="text-lg flex gap-2 items-center justify-center font-medium min-w-fit"
          aria-label="Sort options"
        >
          <span>{t('name')}:</span>
          <span className="flex gap-1 text-sm">
            <CurrentIcon className="size-4" />
            {displaySortText}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          dir={locale === 'en' ? 'ltr' : 'rtl'}
          value={sortQuery}
          onValueChange={setSortQuery}
        >
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
