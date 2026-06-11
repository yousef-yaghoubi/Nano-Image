import { Skeleton } from '@/components/ui/skeleton';
import ShowPromptsSkeleton from './ShowPromptsSkeleton';

function HomeSkeleton() {
  return (
    <>
      <section className="mb-5 flex h-fit w-full flex-col md:justify-around xl:flex-row">
        <div className="my-20 flex flex-col justify-around">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-14 w-64 md:h-20 md:w-80" />
            <Skeleton className="h-10 max-w-2xl md:h-14 md:w-[50em] 2xl:w-[35em]" />
          </div>

          <Skeleton className="mt-40 h-32 rounded-3xl lg:w-[40em]" />
        </div>
        <Skeleton className="mx-auto h-96 w-96 rounded-full md:h-[35em] md:w-[35em] xl:h-80 xl:w-80 2xl:h-[35em] 2xl:w-[35em]" />
      </section>

      <Skeleton className="mt-36 mb-20 h-36 w-full rounded-lg rounded-tl-none md:w-full md:rounded-3xl" />

      <ShowPromptsSkeleton showSimple showHead showDesc />
    </>
  );
}

export default HomeSkeleton;
