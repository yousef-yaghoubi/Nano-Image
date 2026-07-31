'use client';

import EditPromptAction from '@/components/shared/Prompts/EditPromptAction';
import RemovePromptAction from '@/components/shared/Prompts/RemovePromptAction';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PromptType } from '@/types/data';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { Suspense } from 'react';
import { formatDate } from '@/lib/FormatDate';
import dynamic from 'next/dynamic';

const columnHelper = createColumnHelper<PromptType & { buttons: string }>();

const ImageModal = dynamic(
  () => import('@/components/shared/ImageModal').then((m) => m.ImageModal),
  { ssr: false, loading: () => <Skeleton className="h-14 w-24" /> }
);

export type TableTranslations = (key: string) => string;

interface GetColumnsOptions {
  t: TableTranslations;
  tTags: TableTranslations;
  page: number;
  limit: number;
  locale?: string;
  onStatusFilterChange: (value: string) => void;
  statusFilter: string;
  openDialog: (config: {
    title?: React.ReactNode;
    desc?: React.ReactNode;
    content?: React.ReactNode;
    className?: string;
  }) => void;
}

const items = [
  { label: 'All', value: 'All' },
  { label: 'False', value: 'False' },
  { label: 'True', value: 'True' },
  { label: 'Pending', value: 'Pending' },
];

export function getColumns({
  t,
  tTags,
  page,
  limit,
  locale,
  onStatusFilterChange,
  statusFilter,
  openDialog,
}: GetColumnsOptions) {
  return [
    columnHelper.accessor((_row, index) => index, {
      id: 'index',
      header: t('index'),
      cell: (info) => (page - 1) * limit + info.row.index + 1,
      enableSorting: false,
      minSize: 70,
      enableHiding: false,
    }),

    columnHelper.accessor('image', {
      header: t('image'),
      cell: (i) => (
        <ImageModal
          src={i.getValue()}
          trigger={
            <div className="border-border bg-muted relative block h-14 w-24 justify-self-center overflow-hidden rounded-lg border">
              <Suspense fallback={<Skeleton className="h-14 w-24" />}>
                <Image
                  alt="Prompt"
                  src={i.getValue()}
                  fill
                  className="cursor-pointer object-cover"
                  sizes="96px"
                />
              </Suspense>
            </div>
          }
        ></ImageModal>
      ),
      enableHiding: false,
      enableSorting: false,
    }),

    columnHelper.accessor('title', {
      header: t('title'),
      cell: (i) => (
        <strong className="whitespace-normal">{i.getValue()}</strong>
      ),
      enableSorting: true,
      enableHiding: false,
      maxSize: 100,
    }),

    columnHelper.accessor('tags', {
      header: t('tags'),
      cell: (i) => {
        const tags = i.getValue();
        if (!tags?.length) return null;
        return (
          <Button
            className="bg-primary px-4 py-2"
            onClick={() =>
              openDialog({
                title: t('tags'),
                className: 'flex flex-wrap gap-2',
                content: tags.map((tag) => (
                  <Badge key={tag}>{tTags(tag)}</Badge>
                )),
              })
            }
          >
            {t('seeTags')}
          </Button>
        );
      },
      enableSorting: false,
    }),

    columnHelper.accessor('likes', {
      header: t('likes'),
      cell: (i) => <strong>{i.getValue()}</strong>,
      enableSorting: true,
    }),

    columnHelper.accessor('status', {
      header: () => (
        <div className="flex w-full items-center justify-center gap-2">
          {t('status.status')}:
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-fit cursor-pointer border-none bg-transparent p-0 text-sm ring-0 outline-0 focus-visible:border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(`status.${item.value}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ),
      cell: (i) => {
        const value = i.getValue();
        const color =
          value === 'False'
            ? 'bg-red-600'
            : value === 'True'
              ? 'bg-primary'
              : 'bg-secondary-foreground';
        return <Badge className={color}>{t(`status.${value}`)}</Badge>;
      },
      meta: {
        translationKey: 'status.status',
      },
      enableSorting: false,
      filterFn: (row, _columnId, filterValue) => {
        if (filterValue === 'All') return true;
        return row.getValue('status') === filterValue;
      },
      enableGlobalFilter: true,
    }),

    columnHelper.accessor('createdAt', {
      header: t('createdAt'),
      cell: (info) => {
        const date = info.getValue();

        return (
          <span>
            {formatDate(date, {
              calendar: locale == 'fa' ? 'jalali' : 'gregorian',
              format: locale == 'fa' ? 'DD/MM/YYYY' : 'MM/DD/YYYY',
            })}
          </span>
        );
      },
      enableSorting: true,
    }),

    columnHelper.accessor('buttons', {
      header: t('buttons'),
      enableSorting: false,
      cell: (i) => {
        const prompt = i.row.original.prompt;
        const title = i.row.original.title;
        return (
          <div className="flex justify-center gap-3">
            <RemovePromptAction promptId={String(i.row.original._id)} />
            <EditPromptAction
              promptId={String(i.row.original._id)}
              prompt={prompt}
              title={title}
            />
          </div>
        );
      },
    }),
  ];
}
