'use client';
import { useState, useEffect, useRef } from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/Table/Table';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';
import HeadPage from '@/components/shared/Prompts/HeadPage';
import { MyUsersResponse } from '@/services/users';
import useUsers from '@/hooks/queries/useUsers';

export default function page() {
  const t = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const tAdmin = useTranslations('Pages.Admin');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const locale = useLocale();
  // ✅ Fixed: track previous search to only reset page when search actually changes
  const prevSearchRef = useRef(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      // ✅ Only reset page if the debounced search value actually changed
      if (prevSearchRef.current !== searchInput) {
        prevSearchRef.current = searchInput;
        setPage(1);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSortingChange = (newSorting: SortingState) => {
    setSorting(newSorting);
    setPage(1);
  };

  // ✅ Removed unused sortField and sortOrder variables

  const sortString = sorting[0]
    ? `${sorting[0].id === 'createdAt' ? 'date' : sorting[0].id} ${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const { data, isLoading } = useUsers<MyUsersResponse>({
    page: String(page),
    limit,
    search,
    role: columnFilters.find((f) => f.id === 'role')?.value as
      | 'ADMIN'
      | 'MEMBER'
      | 'SUPER_ADMIN'
      | undefined,
    ...(sortString && { sort: sortString }),
  });

  const Columns = getColumns({
    t,
    page,
    limit,
    statusFilter:
      (columnFilters.find((f) => f.id === 'role')?.value as string) ?? 'All',
    locale: locale,
    onStatusFilterChange: (value) => {
      setColumnFilters(value === 'All' ? [] : [{ id: 'role', value }]);
    },
  });

  return (
    <>
      <HeadPage head={tAdmin('users.users')} />
      <DataTable
        className="w-full"
        Columns={Columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        // Sorting
        sortingState={sorting}
        onSortingChange={handleSortingChange}
        // Pagination
        enablePagination
        page={page}
        limit={limit}
        // ✅ Fixed: allCount can be undefined, fall back to totalCount then 0
        totalCount={data?.pagination?.total ?? data?.allCount ?? 0}
        pageSizeOptions={[5, 10, 25, 50]}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        // Search
        enableSearch
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder={t('searchPlaceholder', {
          value: `${t('firstName')} , ${t('lastName')}`,
        })}
        // Empty state
        emptyMessage={tMessages('emptyMessageUsers')}
        enableSelectColumns
      />
    </>
  );
}
