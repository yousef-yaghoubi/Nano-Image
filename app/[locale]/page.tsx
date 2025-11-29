import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
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

  return <ShowPrompts prompt={prompt} />;
}
