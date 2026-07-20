'use client';
import { useTableState } from '@/components/shared/Table/useTableState';
import { TablePage } from '@/components/shared/Table/TablePage';
import usePrompts from '@/hooks/queries/usePrompts';
import type { MyPromptsResponse } from '@/services/prompts';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';

export default function PromptsWrapper() {
  const t = useTranslations('Table');
  const tTags = useTranslations('Filter.filter.tag');
  const tMyPrompts = useTranslations('Pages.MyPrompts');
  const locale = useLocale();

  const state = useTableState();

  const { data, isLoading } = usePrompts<MyPromptsResponse>({
    page: String(state.page),
    limit: state.limit,
    search: state.search,
    status: state.filterValue as 'True' | 'False' | 'Pending' | undefined,
    ...(state.sortString && { sort: state.sortString }),
    forApi: 'get-me/prompts',
  });

  const columns = getColumns({
    t,
    tTags,
    page: state.page,
    limit: state.limit,
    locale,
    statusFilter: state.filterValue ?? 'All',
    onStatusFilterChange: (v) => state.onFilterChange('status', v),
  });

  return (
    <TablePage
      headTitle={tMyPrompts('head')}
      state={state}
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      totalCount={data?.pagination?.total ?? data?.allCount ?? 0}
      searchPlaceholder={t('searchPlaceholder', {
        value: `${t('title')} , ${t('prompt')}`,
      })}
      emptyMessage={t('messages.emptyMessage')}
      emptyDescription={t('messages.emptyDescription')}
    />
  );
}
