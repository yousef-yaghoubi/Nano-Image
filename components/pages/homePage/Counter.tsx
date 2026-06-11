import { CountingNumber } from '@/components/ui/shadcn-io/counting-number';

export function Counter({ count, title }: { count: number; title: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg p-4">
      <span className="text-primary flex items-center gap-1 text-xl font-bold md:text-2xl">
        +
        <CountingNumber
          number={count}
          inView={true}
          transition={{ stiffness: 50, damping: 30 }}
        />
      </span>
      <span className="text-lg md:text-xl">{title}</span>
    </div>
  );
}
