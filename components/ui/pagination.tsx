import * as React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn('flex flex-row items-center gap-1', className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  isDisabled?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
} & Omit<React.ComponentProps<typeof Link>, 'size'>;

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, isDisabled, size = 'icon', ...props }, ref) => {
    return (
      <Link
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={isDisabled}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? 'outline' : 'ghost',
            size,
          }),
          isDisabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
PaginationLink.displayName = 'PaginationLink';

type PaginationPreviousProps = Omit<PaginationLinkProps, 'size'>;

const PaginationPrevious = React.forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to previous page"
        size="default"
        className={cn('gap-1 px-2.5 sm:pe-4', className)}
        {...props}
      >
        <ChevronLeftIcon size={16} />
        <span>Previous</span>
      </PaginationLink>
    );
  },
);
PaginationPrevious.displayName = 'PaginationPrevious';

type PaginationNextProps = Omit<PaginationLinkProps, 'size'>;

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  ({ className, ...props }, ref) => {
    return (
      <PaginationLink
        ref={ref}
        aria-label="Go to next page"
        size="default"
        className={cn('gap-1 px-2.5 sm:ps-4', className)}
        {...props}
      >
        <span>Next</span>
        <ChevronRightIcon size={16} />
      </PaginationLink>
    );
  },
);
PaginationNext.displayName = 'PaginationNext';

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon size={16} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
