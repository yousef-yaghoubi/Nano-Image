import ParentCounter from '@/components/pages/homePage/ParentCounter';
import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import EmblaSlider from '@/components/pages/homePage/Slider';
import getPrompts from '@/services/getPrompts';
import { DataFullType } from '@/types/data';
import { getTranslations } from 'next-intl/server';
import { SlideContent } from '@/types/slider';

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

  const slides: SlideContent[] = [
    { title: 'Slide 1', image: '/images/slide1.webp' },
    { title: 'Slide 2', image: '/images/slide2.webp' },
    { title: 'Slide 3', image: '/images/slide3.webp' },
    { title: 'Slide 4', image: '/images/slide4.webp' },
    { title: 'Slide 5', image: '/images/slide5.webp' },
    { title: 'Slide 6', image: '/images/slide6.webp' },
    { title: 'Slide 8', image: '/images/slide8.webp' },
    { title: 'Slide 9', image: '/images/slide9.webp' },
    { title: 'Slide 10', image: '/images/slide10.webp' },
    { title: 'Slide 11', image: '/images/slide11.webp' },
  ];

  const slideTexts = [
    { text: 'Gemini' },
    { text: 'ChatGPT' },
    { text: 'Firefly' },
    { text: 'Bing' },
    { text: 'Leonardo' },
    { text: 'Krea' },
    { text: 'Ideogram' },
    { text: 'Midjourney' },
    { text: 'Fotor' },
    { text: 'DALL·E' },
    { text: 'Phot Ai' },
  ];

  return (
    <>
      <section className="gap-5 flex flex-col xl:flex-row md:justify-around w-full h-fit mb-5">
        <div className="w-full flex flex-col my-5 gap-5 justify-around">
          <div className="flex flex-col gap-5">
            <h1
              className="font-black text-4xl md:text-7xl textGradient bg-clip-text text-transparent text-gradient-shadow"
              data-text="Nano Prompt"
            >
              Nano Prompt
            </h1>

            <h3
              className="text-xl md:text-4xl textGradient text-gradient-shadow"
              data-text={t('head')}
            >
              {t('head')}
            </h3>
          </div>
          <ParentCounter />
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

      <ShowPrompts prompt={prompt} showSimple={false} />
    </>
  );
}
