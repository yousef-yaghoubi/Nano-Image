'use client';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type LoadingProps = {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: React.ComponentProps<'div'>['className'];
  classNameLoading?: React.ComponentProps<'svg'>['className'];
};

const sizes = {
  sm: 'size-5',
  md: 'size-8',
  lg: 'size-12',
};

export function Loading({
  text = 'loading',
  fullScreen = false,
  size = 'md',
  className,
  classNameLoading,
}: LoadingProps) {
  const tMessages = useTranslations('Messages');
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-3',
        fullScreen && 'bg-background/80 fixed inset-0 z-50 backdrop-blur-sm',
        !fullScreen && 'py-10',
        className
      )}
    >
      <LoaderCircle
        className={cn(
          'text-primary animate-spin',
          classNameLoading,
          sizes[size]
        )}
      />

      {text && (
        <p className="text-background text-sm font-medium">
          {tMessages(text)}
        </p>
      )}
    </div>
  );
}
