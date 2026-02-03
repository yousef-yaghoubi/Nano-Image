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
    <div className="font-extrabold text-3xl">
      {showHead && <Skeleton className="h-10 md:h-12 w-64 md:w-80 mb-4" />}

      {showDesc && <Skeleton className="h-6 md:h-7 w-full max-w-2xl mb-4" />}

      {!showSimple && (
        <div className="flex w-full justify-between items-center border-b pb-5">
          <div className="flex gap-4 items-center justify-between w-f">
            <Skeleton className="h-10 w-32 md:w-40" />
            <Skeleton className="h-10 w-32 md:w-40" />
          </div>
        </div>
      )}

      <div
        className={cn(
          'w-full grid gap-10 justify-items-center mt-10',
          gridClass
        )}
      >
        {Array.from({ length: cardCount }).map((_, index) => (
          <Skeleton className="w-full md:w-72 h-52 sm:h-64 md:h-96 rounded-lg md:rounded-3xl rounded-tl-none" key={index}/>
        ))}
      </div>

      {!showSimple ? (
        <div className="mt-10 flex justify-center gap-2">
          {/* {Array.from({ length: 5 }).map((_, index) => ( */}
          <Skeleton className="h-10 w-40 md:h-12" />
          {/* // ))} */}
        </div>
      ) : (
        <Skeleton className="m-auto mt-4 h-10 w-32 md:w-40 md:h-12" />
      )}
    </div>
  );
}

export default ShowPromptsSkeleton;
