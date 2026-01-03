'use client';
import { cn } from '@/lib/utils';
import Card from '../Card/Card';
import { FilterSort } from '../FilteringData/Filter';
import PaginationFull from '../PaginationFull';
import { DataFullType, PromptType } from '@/types/data';
import { MotionButton } from '../MotionWarpper';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

function ShowPrompts({
  prompt,
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = true,
  head,
  desc,
}: {
  prompt: DataFullType;
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
}) {
  const router = useRouter();
  const t = useTranslations("Pages.Home")
  return (
    <div className="font-extrabold text-3xl">
      {head && desc && (
        <>
          <h1 className="text-3xl md:heading-1 text-primary font-black">
            {head}
          </h1>
          <p className="text-lg md:text-xl font-light">{desc}</p>
        </>
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
        <div className="mt-10 text-3xl">
          <PaginationFull
            totalPages={prompt?.pagination?.totalPages}
            currentPage={prompt?.pagination?.currentPage}
          />
        </div>
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
  );
}

export default ShowPrompts;
