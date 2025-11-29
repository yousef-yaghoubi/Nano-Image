import AuthButtons from '@/components/shared/AuthButtons';
import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import getFavoritesPrompts from '@/services/getFavoritesPrompts';
import { DataFullType } from '@/types/data';
import { auth } from '@clerk/nextjs/server';
import { get } from 'http';
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

  const prompt = (await getFavoritesPrompts({
    page,
    tags,
    search,
    sort,
  })) as DataFullType;

  const t = await getTranslations('Pages.favorites');
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h2 className="heading-2">{t('notAuthenticated')}</h2>
        <div className="flex gap-2">
          <AuthButtons isAuthenticated={isAuthenticated}></AuthButtons>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="heading-1 mb-4">{t('head')}</h1>
      <ShowPrompts prompt={prompt} />
    </>
  );
}

export default page;
