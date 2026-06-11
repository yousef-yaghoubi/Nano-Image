'use client';

import { useState, useEffect } from 'react';
import {
  Pagination as PaginationUI,
  PaginationPrevious,
  PaginationLink,
  PaginationItem,
  PaginationContent,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';

type BasePaginationProps = {
  page: number;
  limit: number;
  totalCount: number;
  pageSizeOptions?: number[];
  className?: string;
  showInfo?: boolean;
  showPageSizeSelector?: boolean;
};

interface PaginationPropsWithUrlChange extends BasePaginationProps {
  changeByUrl: true;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

interface PaginationPropsWithoutUrlChange extends BasePaginationProps {
  changeByUrl: false;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export type PaginationProps =
  | PaginationPropsWithUrlChange
  | PaginationPropsWithoutUrlChange;

export function Pagination({
  page,
  limit,
  totalCount,
  changeByUrl,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [5, 10, 25, 50],
  className = '',
  showInfo = true,
  showPageSizeSelector = true,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / limit); // ✅ derived, no stale state
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const siblings = isMobile ? 0 : 1;

  // ✅ Fixed: uses the `targetPage` parameter instead of the outer `page` variable
  const getHrefWithPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage === 1) {
      params.delete('page');
    } else {
      params.set('page', targetPage.toString());
    }
    return `?${params.toString()}`;
  };

  const showPages = () => {
    const pages = [];

    const startPage = Math.max(page - siblings, 2);
    const endPage = Math.min(page + siblings, totalPages - 1);

    // ✅ Fixed: pass 1 to getHrefWithPage, not current `page`
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => changeByUrl === false && onPageChange(1)}
          isActive={page === 1}
          href={changeByUrl === true ? getHrefWithPage(1) : ''}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (startPage > 2) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => changeByUrl === false && onPageChange(i)}
            href={changeByUrl === true ? getHrefWithPage(i) : ''}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // ✅ Fixed: pass `totalPages` to getHrefWithPage, not current `page`
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => changeByUrl === false && onPageChange(totalPages)}
            isActive={page === totalPages}
            href={changeByUrl === true ? getHrefWithPage(totalPages) : ''}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  if (totalPages === 0) return null;

  return (
    <div
      className={`mt-4 flex flex-col items-center justify-between gap-4 p-2 lg:flex-row ${className}`}
    >
      {showInfo && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {/* ✅ Fixed: Math.min avoids showing more than totalCount on last page */}
          نمایش {Math.min(limit * page, totalCount)} از {totalCount}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 sm:flex-row">
        {showPageSizeSelector && (
          <Select
            onValueChange={(value) => {
              if (!changeByUrl) {
                onLimitChange?.(Number(value));
              }
            }}
            value={limit.toString()}
          >
            <SelectTrigger className="w-30">
              <SelectValue />
              <span>نمایش</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <PaginationUI dir="ltr">
          <PaginationContent className="overflow-x-auto whitespace-nowrap">
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    changeByUrl === false && onPageChange(page - 1)
                  }
                  href={changeByUrl === true ? getHrefWithPage(page - 1) : ''}
                />
              </PaginationItem>
            )}

            {showPages()}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    changeByUrl === false && onPageChange(page + 1)
                  }
                  href={changeByUrl === true ? getHrefWithPage(page + 1) : ''}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </PaginationUI>
      </div>
    </div>
  );
}
