'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import Card from '../Card/Card';
import { FilterSort } from '../FilteringData/Filter';
import { DataType, PromptType } from '@/types/data';
import { MotionButton, MotionDiv } from '../MotionWarpper';
import { useTranslations } from 'next-intl';
import { Pagination } from '../Table/Pagination';
import HeadPage from './HeadPage';
import Link from 'next/link';

interface ShowPromptsProps {
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
  // حالت لودینگ
  isLoading?: boolean;
  cardCount?: number;
  // داده — وقتی isLoading=false باید پاس بشه
  prompt?: DataType<PromptType[]>;
}

function ShowPrompts({
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  head,
  desc,
  isLoading = false,
  cardCount = 8,
  prompt,
}: ShowPromptsProps) {
  const t = useTranslations('Pages.Home');

  const showHead = !!head;

  return (
    <div className="text-3xl font-extrabold">
      {/* ─── سربرگ ─── */}
      {showHead && <HeadPage head={head!} desc={desc} />}

      {/* ─── نوار فیلتر ─── */}
      {!showSimple && (
        <div className="flex w-full items-center justify-between border-b pb-5">
          <FilterSort />
        </div>
      )}

      {/* ─── گرید کارت‌ها ─── */}
      <div
        className={cn(
          'mt-10 grid w-full justify-items-center gap-10',
          gridClass
        )}
      >
        {isLoading
          ? Array.from({ length: cardCount }).map((_, index) => (
              <Skeleton
                className="h-52 w-full rounded-lg rounded-tl-none sm:h-64 md:h-96 md:w-72 md:rounded-3xl"
                key={index}
              />
            ))
          : prompt?.data?.map((item: PromptType) => (
              <Card data={item} key={String(item._id)} />
            ))}
      </div>

      {/* ─── صفحه‌بندی / دکمهٔ بیشتر ─── */}
      {!showSimple ? (
        isLoading ? (
          <div className="mt-10 flex justify-center gap-2">
            <Skeleton className="h-10 w-40 md:h-12" />
          </div>
        ) : (
          <MotionDiv
            initial={{ y: 100, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            viewport={{ once: true }}
            className="mt-10 text-3xl"
          >
            <div className="flex justify-center">
              <Pagination
                page={prompt?.pagination?.currentPage as number}
                totalCount={prompt?.pagination?.total as number}
                changeByUrl
                limit={
                  prompt?.pagination?.total !== undefined &&
                  prompt?.pagination?.totalPages !== undefined &&
                  prompt?.pagination?.totalPages !== 0
                    ? Number(
                        prompt.pagination.total / prompt.pagination.totalPages
                      )
                    : 0
                }
                showInfo={false}
                showPageSizeSelector={false}
                className="mx-auto"
              />
            </div>
          </MotionDiv>
        )
      ) : isLoading ? (
        <Skeleton className="m-auto mt-4 h-10 w-32 md:h-12 md:w-40" />
      ) : (
        <Link href={'/prompts'} className="mx-auto block w-fit">
          <MotionButton
            initial={{ y: 100, opacity: 0.5 }}
            whileInView={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            viewport={{ once: true }}
            className="border-primary text-primary m-auto mt-4 flex cursor-pointer rounded-md border px-10 py-2 text-base font-medium md:rounded-lg md:text-lg md:font-bold"
          >
            {t('more')}
          </MotionButton>
        </Link>
      )}
    </div>
  );
}

export default ShowPrompts;
