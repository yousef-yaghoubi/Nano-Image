import ParentCounter from '@/components/pages/homePage/ParentCounter';
import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import EmblaSlider from '@/components/pages/homePage/Slider';
import getPrompts from '@/services/getPrompts';
import { DataFullType } from '@/types/data';
import { getTranslations } from 'next-intl/server';
import { slides, slideTexts } from '@/lib/data';

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
    forApi: 'prompts',
    limit: 12,
  })) as DataFullType;
  const t = await getTranslations('Pages.Home');

  return (
    <>
      <section className="gap-5 flex flex-col xl:flex-row md:justify-around w-full h-fit mb-5">
        <div className="w-full flex flex-col my-5 gap-5 justify-around">
          <div className="flex flex-col gap-5">
            <h1
              className="font-black text-4xl md:text-7xl textGradient bg-clip-text text-transparent text-gradient-shadow w-fit"
              data-text="Nano Prompt"
            >
              {t('logo')}
            </h1>

            <h3
              className="text-xl md:text-4xl textGradient text-gradient-shadow w-fit"
              data-text={t('head')}
            >
              {t('head')}
            </h3>
          </div>
          <ParentCounter />
        </div>
        <EmblaSlider containerClassName="md:mt-24" slides={slides} />
      </section>

      <div className="flex justify-around items-center w-full mx-auto backgroundSecond p-2 md:p-5 border border-gray-300 dark:border-gray-700 rounded-3xl my-20 md:my-48">
        <EmblaSlider
          slides={slideTexts}
          enableFade={false}
          aspectRatio={false}
          slidesPerViewMobile={3}
          slidesPerViewTablet={4}
          slidesPerViewDesktop={5}
          minSlideWidth={100}
          autoplayDelay={2000}
        />
      </div>

      <ShowPrompts
        prompt={prompt}
        showSimple={true}
        head={t('headPopular')}
        desc={t('descPopular')}
      />
    </>
  );
}
