'use client';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { useTableState } from '@/components/shared/Table/useTableState';
import { TablePage } from '@/components/shared/Table/TablePage';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';
import { MyUsersResponse } from '@/services/users';
import useUsers from '@/hooks/queries/useUsers';

export default function page() {
  const t = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const tAdmin = useTranslations('Pages.Admin');
  const locale = useLocale();

  const state = useTableState();

  const { data, isLoading } = useUsers<MyUsersResponse>({
    page: String(state.page),
    limit: state.limit,
    search: state.search,
    role: state.filterValue as 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN' | undefined,
    ...(state.sortString && { sort: state.sortString }),
  });

  const columns = getColumns({
    t,
    page: state.page,
    limit: state.limit,
    locale,
    statusFilter: state.filterValue ?? 'All',
    onStatusFilterChange: (v) => state.onFilterChange('role', v),
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
        headTitle={tAdmin('users.users')}
        searchPlaceholder={t('searchPlaceholder', {
          value: `${t('firstName')} , ${t('lastName')}`,
        })}
        emptyMessage={tMessages('emptyMessageUsers')}
      />
    </MotionDiv>
  );
}
