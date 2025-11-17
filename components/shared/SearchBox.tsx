'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
export default function SearchBox(control: React.ComponentProps<'input'>) {
  return (
    <div className="*:not-first:mt-2 mb-2">
      {/* <Label htmlFor={id}>Search input with icon and button</Label> */}
      <div className="relative">
        <Input
          className="peer ps-9 pe-9 font-medium"
          placeholder="Search in title and prompt..."
          type="search"
          {...control}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  );
}
