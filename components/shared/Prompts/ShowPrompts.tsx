import { FilterSort } from '../FilteringData/Filter';
import Card from '../Card';
import PaginationFull from '../PaginationFull';
import { DataFullType, PromptType } from '@/types/data';

function ShowPrompts({ prompt }: { prompt: DataFullType }) {
  return (
    <div className="font-extrabold text-3xl">
      <div className="flex w-full justify-between items-center border-b pb-5">
        <FilterSort />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-items-center mt-10">
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
