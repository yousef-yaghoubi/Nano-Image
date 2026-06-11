import EmblaSlider from '@/components/pages/homePage/Slider';
import { getTranslations } from 'next-intl/server';
import { slides, slideTexts } from '@/lib/data';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ParentCounter from '@/components/pages/homePage/ParentCounter';
import ShowPromptsWrapper from '@/components/pages/homePage/ShowPromptsWrapper';
import ShowPromptsSkeleton from '@/components/pages/homePage/ShowPromptsSkeleton';
import HomeSkeleton from '@/components/pages/homePage/HomeSkeleton';

async function HomeContent() {
  const t = await getTranslations('Pages.Home');

  return (
    <>
      <section className="mb-5 flex h-fit w-full flex-col gap-5 md:justify-around xl:flex-row">
        <div className="my-5 flex w-full flex-col justify-around gap-5">
          <div className="flex flex-col gap-5">
            <h1
              className="textGradient text-gradient-shadow w-fit bg-clip-text text-4xl font-black text-transparent md:text-7xl"
              data-text="Nano Prompt"
            >
              {t('logo')}
            </h1>

            <h3
              className="textGradient text-gradient-shadow w-fit text-xl md:text-4xl"
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

      <div className="backgroundSecond mx-auto my-20 flex w-full items-center justify-around rounded-3xl border border-gray-300 p-2 md:my-48 md:p-5 dark:border-gray-700">
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
          showSimple
          head={t('headPopular')}
          desc={t('descPopular')}
        />
      </Suspense>
    </>
  );
}

export default async function Home() {
  return (
    <Suspense
      fallback={<HomeSkeleton/>}
    >
      <HomeContent />
    </Suspense>
  );
}
