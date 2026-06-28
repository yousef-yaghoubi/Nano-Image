'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
export default function SearchBox(control: React.ComponentProps<'input'>) {
  return (
    <div className="mb-2 *:not-first:mt-2 w-full">
      <div className="relative">
        <Input
          placeholder="Search in title and prompt..."
          type="search"
          {...control}
          className={clsx('peer px-8! font-medium', control.className)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
