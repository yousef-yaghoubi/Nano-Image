'use client';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { useTableState } from '@/components/shared/Table/useTableState';
import { TablePage } from '@/components/shared/Table/TablePage';
import usePrompts from '@/hooks/queries/usePrompts';
import useDeletePromptsBulk from '@/hooks/mutations/useDeletePromptsBulk';
import useUpdatePromptsStatusBulk from '@/hooks/mutations/useUpdatePromptsStatusBulk';
import type { MyPromptsResponse } from '@/services/prompts';
import { useLocale, useTranslations } from 'next-intl';
import { getColumns } from './Columns';
import { Button } from '@/components/ui/button';
import { Trash2, CircleCheckBig } from 'lucide-react';
import { statusPrompt } from '@/lib/data';
import { useDrawerDialog } from '@/providers/DrawerDialogProvider';

export default function PromptsTableClient() {
  const t = useTranslations('Table');
  const tMessages = useTranslations('Messages');
  const tActions = useTranslations('Actions');
  const tAdmin = useTranslations('Pages.Admin.prompts');
  const tTags = useTranslations('Filter.filter.tag');
  const locale = useLocale();
  const { openDialog, closeDialog } = useDrawerDialog();

  const state = useTableState();

  const { data, isLoading } = usePrompts<MyPromptsResponse>({
    page: String(state.page),
    limit: state.limit,
    search: state.search,
    status: state.filterValue as 'True' | 'False' | 'Pending' | undefined,
    ...(state.sortString && { sort: state.sortString }),
    forApi: 'prompts',
  });

  const { mutateAsync: deleteBulk } = useDeletePromptsBulk();
  const { mutateAsync: updateStatusBulk } = useUpdatePromptsStatusBulk();

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

  const prompts = data?.data ?? [];

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
        data={prompts}
        isLoading={isLoading}
        totalCount={data?.pagination?.total ?? data?.allCount ?? 0}
        headTitle={tAdmin('prompts')}
        searchPlaceholder={t('searchPlaceholder', {
          value: `${t('title')} , ${t('prompt')}`,
        })}
        emptyMessage={tMessages('emptyMessagePrompts')}
        emptyDescription={tMessages('emptyDescriptionPrompts')}
        enableRowSelection
        getRowId={(row) => String(row._id)}
        toolbarActions={({ selectedCount, selectedIds, resetSelection }) => (
          <>
            {selectedCount > 0 && (
              <Button
                variant="destructive"
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
            )}

            {selectedCount > 0 && (
              <Button
                variant="outline"
                onClick={() =>
                  openDialog({
                    title: tActions('editStatus.editStatus'),
                    desc: tActions('editStatus.title'),
                    className: 'flex flex-wrap gap-2',
                    content: statusPrompt.map((s) => (
                      <Button
                        key={s.value}
                        variant={
                          s.value === 'True'
                            ? 'default'
                            : s.value === 'False'
                              ? 'destructive'
                              : 'outline'
                        }
                        onClick={async () => {
                          await updateStatusBulk({
                            promptIds: selectedIds,
                            value: s.value,
                          });
                          resetSelection();
                          closeDialog();
                        }}
                      >
                        {t(s.title)}
                      </Button>
                    )),
                  })
                }
              >
                <CircleCheckBig className="mr-1 h-4 w-4" />
                {t('status.status')} ({selectedCount})
              </Button>
            )}
          </>
        )}
      />
    </MotionDiv>
  );
}
