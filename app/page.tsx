import Card from '@/components/shared/Card';
import Filter from '@/components/shared/FilteringData/Filter';
import PaginationFull from '@/components/shared/PaginationFull';
import getPrompts from '@/services/getPrompts';
import { DataFullType } from '@/types/data';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tags?: string; search?: string }>;
}) {
  const page = (await searchParams).page || '1';
  const search = (await searchParams).search;
  const tags = (await searchParams).tags;
  const prompt = (await getPrompts({ page, tags, search })) as DataFullType;

  return (
    <div className="font-extrabold text-3xl">
      <Filter />
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 justify-items-center mt-10">
        {prompt?.data?.map(
          (item: {
            image: string;
            id: string;
            prompt: string;
            title: string;
            likes: number;
          }) => (
            <Card data={item} key={item.id} />
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
