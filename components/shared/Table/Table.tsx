'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { MoveDown, MoveUp } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination } from './Pagination';
import SearchBox from '../Form/SearchBox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

interface Props<TData> {
  data: TData[];
  Columns: ColumnDef<TData, any>[];
  isLoading?: boolean;

  // Empty state
  emptyMessage?: string;
  emptyDescription?: string;

  // Search (server-side — value is just reflected in the input)
  enableSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;

  enableSelectColumns?: boolean;
  // Sorting (server-side)
  sortingState?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Pagination (server-side)
  enablePagination?: boolean;
  page?: number;
  limit?: number;
  totalCount?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;

  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

  // Row selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;

  // Custom toolbar content (rendered next to the search box)
  toolbarActions?: (helpers: {
    selectedCount: number;
    selectedIds: string[];
    resetSelection: () => void;
  }) => ReactNode;

  className?: string;
}

const SKELETON_ROWS = 5;

export function DataTable<TData>({
  data,
  Columns,
  isLoading = false,
  emptyMessage,
  emptyDescription,
  enableSearch = false,
  enableSelectColumns = false,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  sortingState,
  onSortingChange,
  enablePagination = true,
  page = 1,
  limit = 10,
  totalCount,
  pageSizeOptions = [5, 10, 25, 50],
  onPageChange,
  onLimitChange,
  columnFilters: externalColumnFilters,
  onColumnFiltersChange,
  enableRowSelection = false,
  rowSelection: externalRowSelection,
  onRowSelectionChange,
  getRowId,
  toolbarActions,
  className = '',
}: Props<TData>) {
  const [localSorting, setLocalSorting] = useState<SortingState>([]);
  const [localRowSelection, setLocalRowSelection] = useState<RowSelectionState>(
    {}
  );
  const [columnVisibility, setColumnVisibility] = useState({});
  const tTable = useTranslations('Table');
  const locale = useLocale();
  const isServerSideSorting = !!onSortingChange;
  const sorting = isServerSideSorting ? (sortingState ?? []) : localSorting;
  const [localColumnFilters, setLocalColumnFilters] =
    useState<ColumnFiltersState>([]);

  const isServerSideRowSelection = !!onRowSelectionChange;
  const rowSelectionState = isServerSideRowSelection
    ? (externalRowSelection ?? {})
    : localRowSelection;

  const isControlledFilters = !!onColumnFiltersChange;
  const columnFilters = isControlledFilters
    ? (externalColumnFilters ?? [])
    : localColumnFilters;

  const handleColumnFiltersChange = (
    updater:
      | ColumnFiltersState
      | ((prev: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    const next =
      typeof updater === 'function' ? updater(columnFilters) : updater;
    if (isControlledFilters) {
      onColumnFiltersChange?.(next);
    } else {
      setLocalColumnFilters(next);
    }
  };

  const handleSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState)
  ) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater;
    if (isServerSideSorting) {
      onSortingChange?.(next);
    } else {
      setLocalSorting(next);
    }
  };

  const handleRowSelectionChange = (
    updater:
      | RowSelectionState
      | ((prev: RowSelectionState) => RowSelectionState)
  ) => {
    const next =
      typeof updater === 'function' ? updater(rowSelectionState) : updater;
    if (isServerSideRowSelection) {
      onRowSelectionChange?.(next);
    } else {
      setLocalRowSelection(next);
    }
  };

  const selectionColumn: ColumnDef<TData> = {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  const tableColumns = enableRowSelection
    ? [selectionColumn, ...Columns]
    : Columns;

  const table = useReactTable({
    data: data ?? [],
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(enableRowSelection && { rowSelection: rowSelectionState }),
    },
    onColumnFiltersChange: handleColumnFiltersChange,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableRowSelection && {
      onRowSelectionChange: handleRowSelectionChange,
      getRowId,
      enableRowSelection: true,
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: isServerSideSorting ? undefined : getSortedRowModel(),
    manualSorting: isServerSideSorting,
  });

  const rows = table.getRowModel().rows;
  const colCount = tableColumns.length;
  const selectedIds = Object.keys(rowSelectionState).filter(
    (id) => rowSelectionState[id]
  );
  const selectedCount = selectedIds.length;

  const resetSelection = () => {
    setLocalRowSelection({});
  };

  return (
    <div
      className={`backgroundSecond space-y-4 rounded-2xl border border-gray-200 p-5 shadow dark:border-gray-700 ${className}`}
    >
      {/* Search & Actions */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row">
        <div className="flex items-center gap-3">
          {enableSearch && (
            <SearchBox
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          )}

          {toolbarActions?.({ selectedCount, selectedIds, resetSelection })}
        </div>

        {enableSelectColumns && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{tTable('showCoulomns')}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    dir={locale == 'en' ? 'ltr' : 'rtl'}
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {tTable(column.columnDef.meta?.translationKey || column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-primary">
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={`text-center font-bold select-none ${header.column.getCanSort() && 'cursor-pointer hover:opacity-80'}`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === 'asc' && (
                      <MoveUp className="ml-1 inline h-4 w-4" />
                    )}
                    {header.column.getIsSorted() === 'desc' && (
                      <MoveDown className="ml-1 inline h-4 w-4" />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  className={
                    rowIndex % 2 === 0
                      ? 'bg-gray-50 dark:bg-gray-800'
                      : 'bg-white dark:bg-gray-900'
                  }
                >
                  {Array.from({ length: colCount }).map((_, colIndex) => (
                    <TableCell
                      key={`skeleton-cell-${colIndex}`}
                      className="h-20"
                    >
                      <Skeleton className="h-5 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32 text-center">
                  <p className="font-semibold text-gray-500">{emptyMessage}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {emptyDescription}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-primary/20 dark:hover:bg-primary/20 text-center ${i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'dark:bg-primary/10 bg-white'}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ maxWidth: cell.column.columnDef.maxSize }}
                      className="py-3 wrap-break-word whitespace-normal text-gray-700 dark:text-gray-200"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <Pagination
          changeByUrl={false}
          page={page}
          limit={limit}
          totalCount={totalCount ?? data.length}
          pageSizeOptions={pageSizeOptions}
          onPageChange={onPageChange ?? (() => {})}
          onLimitChange={onLimitChange ?? (() => {})}
        />
      )}
    </div>
  );
}
