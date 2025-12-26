import { cn } from '@/lib/utils';
import Card from '../Card/Card';
import { FilterSort } from '../FilteringData/Filter';
import PaginationFull from '../PaginationFull';
import { DataFullType, PromptType } from '@/types/data';

function ShowPrompts({
  prompt,
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
}: {
  prompt: DataFullType;
  gridClass?: string;
}) {
  return (
    <div className="font-extrabold text-3xl">
      <div className="flex w-full justify-between items-center border-b pb-5">
        <FilterSort />
      </div>

      <div className={cn("w-full grid gap-10 justify-items-center mt-10", gridClass)}>
        {prompt?.data?.map((item: PromptType) => (
          <Card data={item} key={String(item._id)} />
        ))}
      </div>

      <div className="mt-10 text-3xl">
        <PaginationFull
          totalPages={prompt?.pagination?.totalPages}
          currentPage={prompt?.pagination?.currentPage}
        />
      </div>
    </div>
  );
}

export default ShowPrompts;
