'use client';
import { usePagination } from '@/hooks/use-pagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
};

export default function PaginationFull({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5,
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay,
  });

  const searchParams = useSearchParams();

  // تابع helper برای ساخت query جدید بدون پاک شدن باقی پارامترها
  const getHrefWithPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page'); // برای صفحه 1، page رو پاک کن
    } else {
      params.set('page', page?.toString());
    }
    return `?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous page */}
        <PaginationItem>
          <PaginationPrevious
            href={getHrefWithPage(currentPage > 1 ? currentPage - 1 : 1)}
            aria-disabled={currentPage === 1}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          />
        </PaginationItem>

        {/* Left ellipsis */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Page numbers */}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={getHrefWithPage(p)} isActive={p === currentPage}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ellipsis */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Next page */}
        <PaginationItem>
          <PaginationNext
            href={getHrefWithPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            aria-disabled={currentPage === totalPages}
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
