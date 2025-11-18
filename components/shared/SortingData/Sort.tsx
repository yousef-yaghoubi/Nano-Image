'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, SortDesc, TimerIcon } from 'lucide-react';
import { useState } from 'react';

export function Sort() {
  const [titleSort, setTitleSort] = useState<string>('');
  const OPTIONS = [
    { id: 1, title: 'Like', icon: <Heart size={20} /> },
    { id: 2, title: 'Create', icon: <TimerIcon size={20} /> },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        <button
          className="text-lg flex gap-2 items-center font-medium"
          aria-label="Open filters"
        >
          {OPTIONS.find((item) => item.title == titleSort)?.icon || (
            <SortDesc size={20} />
          )}
          {titleSort.trim() || 'Sort'}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center">
        <DropdownMenuRadioGroup value={titleSort} onValueChange={setTitleSort}>
          {OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.id}
              value={option.title}
              className="flex items-center justify-start"
            >
              {option.icon}
              {option.title}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
