'use client';

import { DrawerDialog } from '@/components/shared/DrawerDialog';
import EditPromptAction from '@/components/shared/Prompts/EditPromptAction';
import RemovePromptAction from '@/components/shared/Prompts/RemovePromptAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PromptType } from '@/types/data';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { Suspense } from 'react';

const columnHelper = createColumnHelper<PromptType & { buttons: string }>();

export type TableTranslations = (key: string) => string;

interface GetColumnsOptions {
  t: TableTranslations;
  tTags: TableTranslations;
  page: number;
  limit: number;
}

export function getColumns({ t, tTags, page, limit }: GetColumnsOptions) {
  return [
    columnHelper.accessor((_row, index) => index, {
      id: 'index',
      header: t('index'),
      cell: (info) => (page - 1) * limit + info.row.index + 1,
      enableSorting: false,
      minSize: 70,
    }),

    columnHelper.accessor('image', {
      header: t('image'),
      cell: (i) => (
        <div className="border-border bg-muted relative block h-14 w-24 justify-self-center overflow-hidden rounded-lg border">
          <Suspense fallback={<Skeleton className="h-14 w-24" />}>
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
      cell: (i) => (
        <strong className="whitespace-normal">{i.getValue()}</strong>
      ),
      enableSorting: true,
      maxSize: 100,
    }),

    columnHelper.accessor('tags', {
      header: t('tags'),
      cell: (i) => {
        const tags = i.getValue();
        if (!tags?.length) return null;
        return (
          <DrawerDialog
            trigger={
              <Button className="bg-primary px-4 py-2">{t('seeTags')}</Button>
            }
            title={t('tags')}
            className="flex flex-wrap gap-2"
          >
            {tags.map((tag) => (
              <Badge key={tag}>{tTags(tag)}</Badge>
            ))}
          </DrawerDialog>
        );
      },
      enableSorting: false,
    }),

    columnHelper.accessor('likes', {
      header: t('likes'),
      cell: (i) => <strong>{i.getValue()}</strong>,
      enableSorting: true,
    }),

    columnHelper.accessor('isPublic', {
      header: t('status.status'),
      cell: (i) => {
        const value = i.getValue();
        const color =
          value === 'False'
            ? 'bg-red-600'
            : value === 'True'
              ? 'bg-primary'
              : 'bg-white';
        return <Badge className={color}>{t(`status.${value}`)}</Badge>;
      },
    }),

    columnHelper.accessor('buttons', {
      header: t('buttons.buttons'),
      enableSorting: false,
      cell: (i) => {
        return (
          <div className="flex justify-center gap-3">
            <RemovePromptAction promptId={String(i.row.original._id)} />
            <EditPromptAction promptId={String(i.row.original._id)} />
          </div>
        );
      },
    }),
  ];
}
