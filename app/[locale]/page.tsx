import EmblaSlider from '@/components/pages/homePage/Slider';
import { getTranslations } from 'next-intl/server';
import { slides, slideTexts } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ParentCounter from '@/components/pages/homePage/ParentCounter';
import ShowPromptsWrapper from '@/components/pages/homePage/ShowPromptsWrapper';
import ShowPromptsSkeleton from '@/components/pages/homePage/ShowPromptsSkeleton';

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    tags?: string;
    search?: string;
    sort?: string;
  }>;
}) {
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
          <Suspense fallback={<Skeleton className="h-32 rounded-3xl" />}>
            <ParentCounter />
          </Suspense>
        </div>
        <EmblaSlider slides={slides} />
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

      <Suspense fallback={<ShowPromptsSkeleton showSimple showHead showDesc />}>
        <ShowPromptsWrapper
          searchParams={searchParams}
          showSimple
          head={t('headPopular')}
          desc={t('descPopular')}
        />
      </Suspense>
    </>
  );
}

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
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-5">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      }
    >
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}
