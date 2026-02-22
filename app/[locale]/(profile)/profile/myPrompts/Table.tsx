'use client';

import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type PaginationState,
  type ColumnDef,
} from '@tanstack/react-table';
import { MoveDown, MoveUp } from 'lucide-react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { getColumns } from './Coulomns';
import type { PromptType } from '@/types/data';
import { MotionDiv } from '@/components/shared/MotionWarpper';

// ─── Constants ───────────────────────────────────────────────────────────────

/** Minimum width applied to each table header and cell for consistent column sizing. */
export const TABLE_CELL_MIN_WIDTH = 'min-w-[7rem]';

// ─── Types ───────────────────────────────────────────────────────────────────

/** Optional messages for pagination and empty state. Omit to use defaults (English). */
export interface DataTableMessages {
  /** e.g. "Page 1 of 5" */
  pageOf: (page: number, total: number) => string;
  /** e.g. "rows" */
  rows: string;
  /** e.g. "Rows per page" */
  rowsPerPage: string;
  /** e.g. "Previous" */
  previous: string;
  /** e.g. "Next" */
  next: string;
  /** e.g. "No results." */
  noResults: string;
}

const DEFAULT_MESSAGES: DataTableMessages = {
  pageOf: (page, total) => `Page ${page} of ${total}`,
  rows: 'rows',
  rowsPerPage: 'Rows per page',
  previous: 'Previous',
  next: 'Next',
  noResults: 'No results.',
};

export interface DataTableProps<TData> {
  /** Row data */
  data: TData[];
  /** Column definitions – build these with createColumnHelper<TData>() */
  columns: ColumnDef<TData, any>[];
  /** Page-size options shown in the "Rows per page" selector (default: [5, 10, 20]) */
  pageSizeOptions?: number[];
  /** Initial page size (default: 5) */
  defaultPageSize?: number;
  /** UI messages for pagination and empty state. Omit to use English defaults. */
  messages?: Partial<DataTableMessages>;
  /** Extra className applied to the outer wrapper */
  className?: string;
  head?: string;
}

// ─── Reusable DataTable (locale-agnostic) ───────────────────────────────────
// Use as: <DataTable data={data} columns={columns} /> for English defaults.
// Pass optional `messages` for i18n (see DataTableMessages and PromptsTable below).

export function DataTable<TData>({
  data,
  columns,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 5,
  messages: messagesProp,
  className,
  head,
}: DataTableProps<TData>) {
  const messages = React.useMemo(
    () => ({ ...DEFAULT_MESSAGES, ...messagesProp }),
    [messagesProp]
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const rowCount = table.getFilteredRowModel().rows.length;

  const handlePreviousPage = React.useCallback(
    () => table.previousPage(),
    [table]
  );
  const handleNextPage = React.useCallback(() => table.nextPage(), [table]);
  const handlePageSizeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      table.setPageSize(Number(e.target.value)),
    [table]
  );

  return (
    <div
      className={clsx(
        'w-full max-w-full rounded-2xl sm:rounded-3xl backgroundSecond border border-gray-300 dark:border-gray-700 p-0.5 sm:p-1 shadow-sm overflow-hidden',
        className
      )}
    >
      {head && <h3 className="heading-3 mb-4 m-2.5">{head}</h3>}

      <MotionDiv
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]"
      >
        <Table className="min-w-full w-max rounded-xl sm:rounded-2xl overflow-hidden">
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="h-16 bg-linear-to-r from-[#4d94b0] via-[#57c785] to-[#00b487]"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const toggleSort = canSort
                    ? header.column.getToggleSortingHandler()
                    : undefined;

                  return (
                    <TableHead
                      key={header.id}
                      onClick={toggleSort}
                      className={clsx(
                        TABLE_CELL_MIN_WIDTH,
                        'px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm',
                        canSort &&
                          'cursor-pointer hover:backdrop-blur-lg hover:bg-[#c8c8c870] select-none'
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {sorted === 'asc' && (
                          <MoveDown className="size-4 sm:size-5 shrink-0" />
                        )}
                        {sorted === 'desc' && (
                          <MoveUp className="size-4 sm:size-5 shrink-0" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={clsx(
                    index % 2 && 'bg-primary/10',
                    'hover:bg-primary/30'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={clsx(
                        TABLE_CELL_MIN_WIDTH,
                        'px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm'
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-6 sm:py-8 text-sm"
                >
                  {messages.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* ── Footer / Pagination ── */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length} className="p-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 border-t border-border px-3 py-2.5 sm:px-4 sm:py-3">
                  {/* Page info */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs text-muted-foreground order-2 sm:order-1">
                    <span>
                      {messages.pageOf(pageIndex + 1, pageCount || 1)}
                    </span>
                    <span className="hidden sm:inline-block">
                      • {rowCount} {messages.rows}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 order-1 sm:order-2">
                    <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                      <span>{messages.rowsPerPage}</span>
                      <select
                        className="h-7 sm:h-8 rounded-md border border-input bg-background px-2 text-[10px] sm:text-xs shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                      >
                        {pageSizeOptions.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 ml-auto sm:ml-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[10px] sm:h-8 sm:px-3 sm:text-xs"
                        onClick={handlePreviousPage}
                        disabled={!table.getCanPreviousPage()}
                      >
                        {messages.previous}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-[10px] sm:h-8 sm:px-3 sm:text-xs"
                        onClick={handleNextPage}
                        disabled={!table.getCanNextPage()}
                      >
                        {messages.next}
                      </Button>
                    </div>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </MotionDiv>
    </div>
  );
}

export { createColumnHelper };
export default DataTable;

// ─── My Prompts table (example: translated DataTable with getColumns) ────────

export function PromptsTable({
  data,
  head,
}: {
  data: PromptType[];
  head?: string;
}) {
  const t = useTranslations('Pages.MyPrompts.Table');
  const columns = React.useMemo(() => getColumns(t), [t]);
  const messages = React.useMemo<DataTableMessages>(
    () => ({
      pageOf: (page, total) => t('pageOf', { page, total }),
      rows: t('rows'),
      rowsPerPage: t('rowsPerPage'),
      previous: t('previous'),
      next: t('next'),
      noResults: t('noResults'),
    }),
    [t]
  );
  return (
    <DataTable data={data} head={head} columns={columns} messages={messages} />
  );
}

// ─── Usage example (keep or delete) ─────────────────────────────────────────
//
// type User = {
//   firstName: string;
//   lastName: string;
//   age: number;
//   visits: number;
//   progress: number;
//   status: string;
// };
//
// const columnHelper = createColumnHelper<User>();
//
// const USER_COLUMNS = [
//   columnHelper.accessor('firstName', { header: 'First Name', cell: (i) => <strong>{i.getValue()}</strong> }),
//   columnHelper.accessor('lastName',  { header: 'Last Name',  cell: (i) => <strong>{i.getValue()}</strong> }),
//   columnHelper.accessor('age',       { header: 'Age',        cell: (i) => <strong>{i.getValue()}</strong> }),
//   columnHelper.accessor('visits',    { header: 'Visits',     cell: (i) => <strong>{i.getValue()}</strong> }),
//   columnHelper.accessor('progress',  { header: 'Progress',   cell: (i) => <strong>{i.getValue()}</strong> }),
//   columnHelper.accessor('status',    { header: 'Status',     cell: (i) => <strong>{i.getValue()}</strong> }),
// ];
//
// const MOCK_DATA: User[] = [ ... ];
//
// export default function Page() {
//   return <DataTable data={MOCK_DATA} columns={USER_COLUMNS} defaultPageSize={5} />;
// }
