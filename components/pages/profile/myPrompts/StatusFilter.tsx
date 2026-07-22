'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table } from '@tanstack/react-table';
import { PromptType } from '@/types/data';

const STATUS_OPTIONS = ['True', 'False', 'Pending'] as const; // adjust to match your actual values

interface StatusFilterProps {
  table: Table<PromptType & { buttons: string }>;
  t: (key: string) => string;
}

export function StatusFilter({ table, t }: StatusFilterProps) {
  const column = table.getColumn('status');
  const selected = (column?.getFilterValue() as string[]) ?? [];

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    column?.setFilterValue(next.length ? next : undefined);
  };

  const colorMap: Record<string, string> = {
    False: 'bg-red-600',
    True: 'bg-primary',
    Pending: 'bg-secondary-foreground',
  };

  return (
    <div className="mb-4 flex items-center gap-2">
      {STATUS_OPTIONS.map((status) => (
        <Badge
          key={status}
          onClick={() => toggle(status)}
          className={`cursor-pointer transition-opacity ${colorMap[status]} ${
            selected.includes(status)
              ? 'opacity-100 ring-2 ring-white'
              : 'opacity-40'
          }`}
        >
          {t(`status.${status}`)}
        </Badge>
      ))}
      {selected.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column?.setFilterValue(undefined)}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
