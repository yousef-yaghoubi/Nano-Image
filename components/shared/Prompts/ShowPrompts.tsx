'use client';
import { cn } from '@/lib/utils';
import Card from '../Card/Card';
import { FilterSort } from '../FilteringData/Filter';
import PaginationFull from '../PaginationFull';
import { DataType, PromptType } from '@/types/data';
import { MotionButton, MotionDiv, MotionH1, MotionP } from '../MotionWarpper';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

function ShowPrompts({
  prompt,
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  head,
  desc,
}: {
  prompt: DataType<PromptType[]>;
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
}) {
  const router = useRouter();
  const t = useTranslations('Pages.Home');
  const params = useParams();
  return (
    <div className="font-extrabold text-3xl">
      {head && (
        <MotionH1
          initial={{
            x: params.locale == 'en' ? -100 : 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 },
          }}
          className="heading-1 mb-4 text-primary"
        >
          {head}
        </MotionH1>
      )}

      {desc && (
        <MotionP
          initial={{
            x: params.locale == 'en' ? -100 : 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 },
          }}
          className="heading-5 mb-4"
        >
          {desc}
        </MotionP>
      )}

      {!showSimple && (
        <div className="flex w-full justify-between items-center border-b pb-5">
          <FilterSort />
        </div>
      )}

      <div
        className={cn(
          'w-full grid gap-10 justify-items-center mt-10',
          gridClass
        )}
      >
        {prompt?.data?.map((item: PromptType) => (
          <Card data={item} key={String(item._id)} />
        ))}
      </div>

      {!showSimple ? (
        <MotionDiv
          initial={{
            y: 100,
            opacity: 0.5,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 1 },
          }}
          viewport={{ once: true }}
          className="mt-10 text-3xl"
        >
          <PaginationFull
            totalPages={prompt?.pagination?.totalPages as number}
            currentPage={prompt?.pagination?.currentPage as number}
          />
        </MotionDiv>
      ) : (
        <MotionButton
          onClick={() => router.push('/prompts')}
          initial={{
            y: 100,
            opacity: 0.5,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            transition: { duration: 1 },
          }}
          viewport={{ once: true }}
          className="m-auto mt-4 flex px-10 py-2 text-base font-medium md:font-bold md:text-lg cursor-pointer border border-primary rounded-md md:rounded-lg text-primary"
        >
          {t('more')}
        </MotionButton>
      )}
    </div>
    // </Suspense>
  );
}

export default ShowPrompts;
