'use client';
import { useTableState } from '@/components/shared/Table/useTableState';
import { TablePage } from '@/components/shared/Table/TablePage';
import usePrompts from '@/hooks/queries/usePrompts';
import type { MyPromptsResponse } from '@/services/prompts';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';
import useDeletePromptsBulk from '@/hooks/mutations/useDeletePromptsBulk';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

export default function PromptsWrapper() {
  const t = useTranslations('Table');
  const tTags = useTranslations('Filter.filter.tag');
  const tActions = useTranslations('Actions');
  const tMyPrompts = useTranslations('Pages.MyPrompts');
  const locale = useLocale();

  const state = useTableState();

  const { mutateAsync: deleteBulk } = useDeletePromptsBulk();

  const { openDialog, closeDialog } = useDrawerDialog();

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
    openDialog,
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
      enableRowSelection
      getRowId={(row) => String(row._id)}
      toolbarActions={({ selectedCount, selectedIds, resetSelection }) =>
        selectedCount > 0 ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              openDialog({
                title: tActions('remove.remove'),
                desc: tActions('remove.title'),
                className: 'flex flex-wrap gap-2',
                content: (
                  <>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await deleteBulk(selectedIds);
                        resetSelection();
                        closeDialog();
                      }}
                    >
                      {tActions('remove.yes')}
                    </Button>
                    <Button variant="outline" onClick={closeDialog}>
                      {tActions('remove.no')}
                    </Button>
                  </>
                ),
              })
            }
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {tActions('remove.remove')} ({selectedCount})
          </Button>
        ) : null
      }
    />
  );
}
