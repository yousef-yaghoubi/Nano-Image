import { CountingNumber } from '@/components/ui/shadcn-io/counting-number';

export function Counter({ count, title }: { count: number; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg p-4 w-28">
      <span className="flex items-center gap-1 text-primary font-bold text-xl md:text-2xl">
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
