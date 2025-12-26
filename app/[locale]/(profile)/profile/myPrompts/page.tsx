import HeadPages from '@/components/shared/HeadPages';
import NotAuthenticated from '@/components/shared/Auth/NotAuthenticated';
import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import getPrompts from '@/services/getPrompts';
import { DataFullType } from '@/types/data';
import { auth } from '@clerk/nextjs/server';
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
  const { isAuthenticated } = await auth();
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
    forApi: 'get-me/prompts',
  })) as DataFullType;

  const t = await getTranslations('Pages.MyPrompts');
  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  return (
    <>
      <HeadPages title={t('head')} />
      {prompt.success ? (
        <ShowPrompts
          prompt={prompt}
          gridClass="grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
        />
      ) : (
        <p>{prompt.message}</p>
      )}
    </>
  );
}

export default page;
