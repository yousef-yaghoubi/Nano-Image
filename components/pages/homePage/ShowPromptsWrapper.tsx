import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import getPrompts from '@/services/getPrompts';
import { DataType, PromptType } from '@/types/data';

type ShowPromptsWrapperProps = {
  searchParams: Promise<{
    page?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }>;
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
};

const ShowPromptsWrapper = async ({
  searchParams,
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  head,
  desc,
}: ShowPromptsWrapperProps) => {
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
    forApi: 'prompts',
    limit: 12,
  })) as DataType<PromptType[]>;

  return (
    <ShowPrompts
      prompt={prompt}
      desc={desc}
      head={head}
      showSimple={showSimple}
      gridClass={gridClass}
    />
  );
};

export default ShowPromptsWrapper;
