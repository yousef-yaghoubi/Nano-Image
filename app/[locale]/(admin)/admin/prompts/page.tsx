'use client';
import { useState, useEffect, useRef } from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DataTable } from '@/components/shared/Table/Table';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import usePrompts from '@/hooks/queries/usePrompts';
import type { MyPromptsResponse } from '@/services/prompts';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';
import HeadPage from '@/components/shared/Prompts/HeadPage';

export default function page() {
  const t = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const tAdmin = useTranslations('Pages.Admin.prompts');
  const tTags = useTranslations('Filter.filter.tag');

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

  const { data, isLoading } = usePrompts<MyPromptsResponse>({
    page: String(page),
    limit,
    search,
    status: columnFilters.find((f) => f.id === 'status')?.value as
      | 'True'
      | 'False'
      | 'Pending'
      | undefined,
    ...(sortString && { sort: sortString }),
    forApi: 'prompts',
  });

  const Columns = getColumns({
    t,
    tTags,
    page,
    limit,
    statusFilter:
      (columnFilters.find((f) => f.id === 'status')?.value as string) ?? 'All',
    locale: locale,
    onStatusFilterChange: (value) => {
      setColumnFilters(value === 'All' ? [] : [{ id: 'status', value }]);
    },
  });


  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <HeadPage head={tAdmin('prompts')} />
      <DataTable
        className="w-full"
        Columns={Columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        sortingState={sorting}
        onSortingChange={handleSortingChange}
        enablePagination
        page={page}
        limit={limit}
        totalCount={data?.pagination?.total ?? data?.allCount ?? 0}
        pageSizeOptions={[5, 10, 25, 50]}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        enableSearch
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder={t('searchPlaceholder', {
          value: `${t('title')} , ${t('prompt')}`
        })}
        emptyMessage={tMessages('emptyMessagePrompts')}
        emptyDescription={tMessages('emptyDescriptionPrompts')}
        enableSelectColumns
      />
    </MotionDiv>
  );
}
