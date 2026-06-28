'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { UserType } from '@/types/data';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { Suspense } from 'react';
import { formatDate } from '@/lib/FormatDate';
import EditRoleUserAction from '@/components/pages/admin/users/EditRoleUserAction';
import { RoleType } from '@/models/enums';

const columnHelper = createColumnHelper<UserType & { buttons: string }>();

export type TableTranslations = (key: string) => string;

interface GetColumnsOptions {
  t: TableTranslations;
  //   tTags: TableTranslations;
  page: number;
  limit: number;
  locale?: string;
  onStatusFilterChange: (value: string) => void; // ← new
  statusFilter: string; // ← new
}

const items = [
  { label: 'All', value: 'All' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Member', value: 'MEMBER' },
  { label: 'Super Admin', value: 'SUPER_ADMIN' },
];

export function getColumns({
  t,
  //   tTags,
  page,
  limit,
  locale,
  onStatusFilterChange,
  statusFilter,
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
        <div className="border-border bg-muted relative block h-8 w-8 justify-self-center overflow-hidden rounded-full border">
          <Suspense fallback={<Skeleton className="h-8 w-8" />}>
            <Image
              alt="user image"
              src={i.getValue()}
              fill
              className="object-cover"
            />
          </Suspense>
        </div>
      ),
      enableHiding: true,
      enableSorting: false,
    }),

    columnHelper.accessor('firstName', {
      header: t('firstName'),
      cell: (i) => (
        <strong className="whitespace-normal">{i.getValue()}</strong>
      ),
      enableSorting: true,
      enableHiding: false,
      maxSize: 100,
    }),

    columnHelper.accessor('lastName', {
      header: t('lastName'),
      cell: (i) => (
        <strong className="whitespace-normal">{i.getValue()}</strong>
      ),
      enableSorting: true,
      enableHiding: false,
      maxSize: 100,
    }),
    columnHelper.accessor('email', {
      header: t('email'),
      cell: (i) => (
        <strong className="whitespace-normal">{i.getValue()}</strong>
      ),
      enableSorting: false,
      enableHiding: true,
      maxSize: 100,
    }),

    columnHelper.accessor('role', {
      cell: (i) => (
        <strong className="whitespace-normal">
          {t(`role.${i.getValue()}`)}
        </strong>
      ),
      header: () => (
        <div className="flex w-full items-center justify-center gap-2">
          {t('role.role')}:
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-fit cursor-pointer border-none bg-transparent p-0 text-sm ring-0 outline-0 focus-visible:border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {t(`role.${item.value}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ),
      meta: {
        translationKey: 'role.role',
      },
      enableSorting: false,
      enableHiding: true,
      maxSize: 100,
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
      enableHiding: true,
    }),

    columnHelper.accessor('buttons', {
      header: t('buttons'),
      cell: (i) => {
        const value = i.row.original.role;

        return (
          <div className="flex items-center justify-center gap-3">
            <EditRoleUserAction
              userId={String(i.row.original._id)}
              role={value as RoleType}
            />
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    }),
  ];
}
