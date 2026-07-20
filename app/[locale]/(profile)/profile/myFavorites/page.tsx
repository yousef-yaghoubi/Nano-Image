import ShowPromptsSkeleton from '@/components/pages/homePage/ShowPromptsSkeleton';
import NotAuthenticated from '@/components/shared/Auth/NotAuthenticated';
import ShowPromptsContainer from '@/components/shared/Prompts/ShowPromptsContainer';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

async function page() {
  const { isAuthenticated } = await auth();
  const t = await getTranslations('Pages.MyFavorites');

  if (!isAuthenticated) {
    return <NotAuthenticated isAuthenticated={isAuthenticated} />;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
    <Suspense
      fallback={
        <ShowPromptsSkeleton
          showHead
          cardCount={12}
          gridClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
        />
      }
    >
      <ShowPromptsContainer
        head={t('head')}
        forApi="favorites"
        gridClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3"
      />
    </Suspense>
    </MotionDiv>
  );
}

export default page;
