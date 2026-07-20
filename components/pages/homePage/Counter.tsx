'use client';
import { CountingNumber } from '@/components/ui/shadcn-io/counting-number';

export function Counter({ count, title }: { count: number; title: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg p-4">
      <span className="text-primary heading-4 flex items-center gap-1">
        +
        <CountingNumber number={count} />
      </span>
      <span className="heading-4">{title}</span>
    </div>
  );
}
