'use client';

import { DrawerDialog } from '@/components/shared/DrawerDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PromptType } from '@/types/data';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { Suspense } from 'react';

const columnHelper = createColumnHelper<PromptType>();

export type TableTranslations = (key: string) => string;

export function getColumns(t: TableTranslations) {
  return [
    columnHelper.accessor((_row, index) => index, {
      id: 'index',
      header: t('index'),
      cell: (info) => {
        const { pageIndex, pageSize } = info.table.getState().pagination;
        return pageIndex * pageSize + info.row.index + 1;
      },
      enableSorting: true,
      minSize: 70
    }),
    columnHelper.accessor('image', {
      header: t('image'),
      cell: (i) => (
        <div className="relative block h-14 w-24 overflow-hidden rounded-lg border border-border bg-muted">
          <Suspense fallback={<Skeleton className="w-24 h-14" />}>
            <Image
              alt="Prompt"
              src={i.getValue()}
              fill
              className="object-cover"
              sizes="96px"
            />
          </Suspense>
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('title', {
      header: t('title'),
      cell: (i) => <strong>{i.getValue()}</strong>,
      enableSorting: true,
    }),
    columnHelper.accessor('tags', {
      header: t('tags'),
      cell: (i) =>
        i.getValue()?.length !== 0 && (
          <DrawerDialog
            trigger={
              <Button className="px-4 py-2 bg-primary">{t('seeTags')}</Button>
            }
            title={t('tagsTitle')}
            className="flex gap-2 flex-wrap"
          >
            {i.getValue()?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </DrawerDialog>
        ),
      enableSorting: false,
    }),
    columnHelper.accessor('likes', {
      header: t('likes'),
      cell: (i) => <strong>{i.getValue()}</strong>,
      enableSorting: true,
    }),
    columnHelper.accessor('isPublic', {
      header: t('status'),
      cell: (i) => <strong>{String(i.getValue())}</strong>,
      enableSorting: true,
    }),
  ];
}
