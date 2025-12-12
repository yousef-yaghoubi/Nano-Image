import NotAuthenticated from '@/components/shared/NotAuthenticated';
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
    forApi: 'favorites',
  })) as DataFullType;

  const t = await getTranslations('Pages.favorites');
  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  return (
    <>
      <h1 className="heading-1 mb-4">{t('head')}</h1>
      {prompt.success ? (
        <ShowPrompts prompt={prompt} />
      ) : (
        <p>{prompt.message}</p>
      )}
    </>
  );
}

export default page;
