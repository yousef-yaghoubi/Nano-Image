import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import getPrompts from '@/services/getPrompts';
import { DataType, PromptType } from '@/types/data';
import { getTranslations } from 'next-intl/server';

async function page({
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
    forApi: 'prompts',
  })) as DataType<PromptType[]>;
  const t = await getTranslations('Pages.MyPrompts');

  return (
    <section>
      <ShowPrompts prompt={prompt} head={t('head')} />
    </section>
  );
}

export default page;
