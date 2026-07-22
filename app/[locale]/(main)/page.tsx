import { getTranslations } from 'next-intl/server';
import { slides, slideTexts } from '@/lib/data';
import { Suspense } from 'react';
import ShowPromptsSkeleton from '@/components/pages/homePage/ShowPromptsSkeleton';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

import dynamic from 'next/dynamic';
import ParentCounterClient from '@/components/pages/homePage/ParentCounterClient';
import EmblaSlider from '@/components/pages/homePage/slider/Slider';

const ShowPromptsContainer = dynamic(
  () => import('@/components/shared/Prompts/ShowPromptsContainer')
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO.home' });
  const path = `/${locale}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const ogImage = `${baseUrl}/images/slide1.webp`;

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: path,
      locale: locale === 'fa' ? 'fa_IR' : locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'Nano Image',
        },
      ],
    },
    twitter: {
      title: t('title'),
      description: t('description'),
      images: [ogImage],
    },
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `/${l}`])
        ),
        'x-default': `/${routing.defaultLocale}`,
      },
    },
  };
}

export default async function Home() {
  const t = await getTranslations('Pages.Home');

  return (
    <section>
      <div className="mb-5 flex h-fit w-full flex-col gap-5 md:justify-around xl:flex-row">
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

          <ParentCounterClient
            promptsLabel={t('Badges.prompts')}
            tagsLabel={t('Badges.tags')}
            likesLabel={t('Badges.likes')}
          />
        </div>
        <EmblaSlider slides={slides} />
      </div>

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
        <ShowPromptsContainer
          gridClass={
            'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
          }
          showSimple
          head={t('headPopular')}
          desc={t('descPopular')}
          limit={12}
        />
      </Suspense>
    </section>
  );
}
