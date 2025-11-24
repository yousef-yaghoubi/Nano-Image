import Card from '@/components/shared/Card';
import { FilterSort } from '@/components/shared/FilteringData/Filter';
import PaginationFull from '@/components/shared/PaginationFull';
import getPrompts from '@/services/getPrompts';
import { DataFullType } from '@/types/data';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }>;
}) {
  const {
    page: rawPage,
    search: rawSearch,
    tags: rawTags,
    sort: rawSort,
  } = await searchParams;

  const page = rawPage || '1';
  const search = rawSearch && rawSearch !== 'undefined' ? rawSearch : '';
  const tags = rawTags && rawTags !== 'undefined' ? rawTags : '';
  const sort = rawSort && rawSort !== 'undefined' ? rawSort : '';

  const prompt = (await getPrompts({
    page,
    tags,
    search,
    sort,
  })) as DataFullType;

  return (
    <div className="font-extrabold text-3xl">
      <div className="flex w-full justify-between items-center border-b pb-5">
        <FilterSort />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 justify-items-center mt-10">
        {prompt?.data?.map(
          (item: {
            image: string;
            id: string;
            prompt: string;
            title: string;
            likes: number;
          }) => (
            <Card data={item} key={item.title} />
          )
        )}
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
