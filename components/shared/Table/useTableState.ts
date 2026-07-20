'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';

export interface TableState {
  page: number;
  limit: number;
  sorting: SortingState;
  searchInput: string;
  search: string;
  sortString: string | undefined;
  columnFilters: ColumnFiltersState;
  filterValue: string | undefined;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSortingChange: (sorting: SortingState) => void;
  setSearchInput: (value: string) => void;
  onFilterChange: (columnId: string, value: string) => void;
}

export function useTableState(initialLimit = 5): TableState {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const prevSearchRef = useRef(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      if (prevSearchRef.current !== searchInput) {
        prevSearchRef.current = searchInput;
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const onSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPage(1);
  }, []);

  const onFilterChange = useCallback((columnId: string, value: string) => {
    setColumnFilters(value === 'All' ? [] : [{ id: columnId, value }]);
  }, []);

  const sortString = sorting[0]
    ? `${sorting[0].id === 'createdAt' ? 'date' : sorting[0].id} ${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const filterValue = columnFilters[0]?.value as string | undefined;

  return {
    page,
    limit,
    sorting,
    searchInput,
    search,
    sortString,
    columnFilters,
    filterValue,
    onPageChange,
    onLimitChange,
    onSortingChange,
    setSearchInput,
    onFilterChange,
  };
}
