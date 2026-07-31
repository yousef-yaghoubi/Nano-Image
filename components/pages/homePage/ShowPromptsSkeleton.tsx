'use client';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function ShowPromptsSkeleton({
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  showHead = true,
  showDesc = true,
  cardCount = 8,
}: {
  gridClass?: string;
  showSimple?: boolean;
  showHead?: boolean;
  showDesc?: boolean;
  cardCount?: number;
}) {
  return (
    <div className="text-3xl font-extrabold">
      {showHead && <Skeleton className="mb-4 h-10 w-64 md:h-12 md:w-80" />}

      {showDesc && <Skeleton className="mb-4 h-6 w-full max-w-2xl md:h-7" />}

      {!showSimple && (
        <div className="flex w-full items-center justify-between border-b pb-5">
          <div className="flex w-full items-center justify-between gap-4">
            <Skeleton className="h-10 w-32 md:w-40" />
            <Skeleton className="h-10 w-32 md:w-40" />
          </div>
        </div>
      )}

      <div
        className={cn(
          'mt-10 grid w-full justify-items-center gap-10',
          gridClass
        )}
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <Skeleton
            className="h-52 w-full rounded-lg rounded-tl-none sm:h-64 md:h-96 md:w-72 md:rounded-3xl"
            key={index}
          />
        ))}
      </div>

      {!showSimple ? (
        <div className="mt-10 flex justify-center gap-2">
          {/* {Array.from({ length: 5 }).map((_, index) => ( */}
          <Skeleton className="h-10 w-40 md:h-12" />
          {/* // ))} */}
        </div>
      ) : (
        <Skeleton className="m-auto mt-4 h-10 w-32 md:h-12 md:w-40" />
      )}
    </div>
  );
}

export default ShowPromptsSkeleton;
