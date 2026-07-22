'use client';

import type { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from './Table';
import type { TableState } from './useTableState';
import HeadPage from '../Prompts/HeadPage';
import type { ReactNode } from 'react';

interface TablePageProps<TData> {
  state: TableState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading: boolean;
  totalCount: number;
  headTitle?: string;
  searchPlaceholder: string;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  // Row selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  getRowId?: (row: TData) => string;
  // Custom toolbar actions
  toolbarActions?: (helpers: {
    selectedCount: number;
    selectedIds: string[];
    resetSelection: () => void;
  }) => ReactNode;
}

export function TablePage<TData>({
  state,
  columns,
  data,
  isLoading,
  totalCount,
  headTitle,
  searchPlaceholder,
  emptyMessage,
  emptyDescription,
  className = 'w-full',
  enableRowSelection,
  rowSelection,
  onRowSelectionChange,
  getRowId,
  toolbarActions,
}: TablePageProps<TData>) {
  return (
    <>
      {headTitle && <HeadPage head={headTitle} />}
      <DataTable
        className={className}
        Columns={columns}
        data={data}
        isLoading={isLoading}
        sortingState={state.sorting}
        onSortingChange={state.onSortingChange}
        enablePagination
        page={state.page}
        limit={state.limit}
        totalCount={totalCount}
        pageSizeOptions={[5, 10, 25, 50]}
        onPageChange={state.onPageChange}
        onLimitChange={state.onLimitChange}
        enableSearch
        searchValue={state.searchInput}
        onSearchChange={state.setSearchInput}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        enableSelectColumns
        enableRowSelection={enableRowSelection}
        rowSelection={rowSelection}
        onRowSelectionChange={onRowSelectionChange}
        getRowId={getRowId}
        toolbarActions={toolbarActions}
      />
    </>
  );
}
