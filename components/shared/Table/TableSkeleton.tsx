import { Skeleton } from '@/components/ui/skeleton';
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { clsx } from 'clsx';

interface TableSkeletonProps {
  /** Number of body rows to render */
  rows?: number;
  /** Number of columns to render */
  columns?: number;
  /** Optional heading above the table */
  head?: boolean;
  /** Extra classes for the outer wrapper */
  className?: string;
}

// Matches the same cell min-width constant used in the real table
const TABLE_CELL_MIN_WIDTH = 'min-w-[100px]';

export function TableSkeleton({
  rows = 5,
  columns = 5,
  head = false,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={clsx(
        'w-full max-w-full rounded-2xl sm:rounded-3xl backgroundSecond border border-gray-300 dark:border-gray-700 p-0.5 sm:p-1 shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Optional heading skeleton */}
      {head && (
        <div className="mb-4 m-2.5">
          <Skeleton className="h-8 w-40" />
        </div>
      )}

      <div className="w-full overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
        <table className="min-w-full w-max rounded-xl sm:rounded-2xl overflow-hidden">
          {/* ── Header ── */}
          <TableHeader>
            <TableRow className="h-16 bg-linear-to-r from-[#4d94b0] via-[#57c785] to-[#00b487]">
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead
                  key={i}
                  className={clsx(
                    TABLE_CELL_MIN_WIDTH,
                    'px-2 py-2 sm:px-3 sm:py-2.5'
                  )}
                >
                  <Skeleton className="h-4 w-24 bg-white/30 dark:bg-white/20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow
                key={rowIdx}
                className={clsx(rowIdx % 2 && 'bg-primary/10')}
              >
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <TableCell
                    key={colIdx}
                    className={clsx(
                      TABLE_CELL_MIN_WIDTH,
                      'px-2 py-2 sm:px-3 sm:py-2.5'
                    )}
                  >
                    {/* Vary widths slightly so it looks more natural */}
                    <Skeleton
                      className={clsx(
                        'h-4',
                        colIdx === 1 && 'h-14',
                        colIdx === 0
                          ? 'w-28'
                          : colIdx % 3 === 0
                          ? 'w-16'
                          : 'w-20'
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>

          {/* ── Footer / Pagination ── */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns} className="p-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-border px-3 py-2.5 sm:px-4 sm:py-3">
                  {/* Page info */}
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="hidden sm:block h-3 w-16" />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
                    {/* Rows-per-page selector */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-7 sm:h-8 w-14 rounded-md" />
                    </div>

                    {/* Prev / Next buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
                      <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 rounded-md" />
                      <Skeleton className="h-7 sm:h-8 w-16 sm:w-20 rounded-md" />
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </table>
      </div>
    </div>
  );
}