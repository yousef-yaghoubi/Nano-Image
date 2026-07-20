'use client';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { useTableState } from '@/components/shared/Table/useTableState';
import { TablePage } from '@/components/shared/Table/TablePage';
import usePrompts from '@/hooks/queries/usePrompts';
import type { MyPromptsResponse } from '@/services/prompts';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';

export default function page() {
  const t = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const tAdmin = useTranslations('Pages.Admin.prompts');
  const tTags = useTranslations('Filter.filter.tag');
  const locale = useLocale();

  const state = useTableState();

  const { data, isLoading } = usePrompts<MyPromptsResponse>({
    page: String(state.page),
    limit: state.limit,
    search: state.search,
    status: state.filterValue as 'True' | 'False' | 'Pending' | undefined,
    ...(state.sortString && { sort: state.sortString }),
    forApi: 'prompts',
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
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <TablePage
        state={state}
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        totalCount={data?.pagination?.total ?? data?.allCount ?? 0}
        headTitle={tAdmin('prompts')}
        searchPlaceholder={t('searchPlaceholder', {
          value: `${t('title')} , ${t('prompt')}`,
        })}
        emptyMessage={tMessages('emptyMessagePrompts')}
        emptyDescription={tMessages('emptyDescriptionPrompts')}
      />
    </MotionDiv>
  );
}
