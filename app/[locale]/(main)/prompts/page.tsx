import ShowPromptsContainer from '@/components/shared/Prompts/ShowPromptsContainer';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import PrefetchBoundary from '@/components/shared/PrefetchBoundary';
import { prefetchPrompts } from '@/lib/query-prefetch';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO.prompts' });
  const path = `/${locale}/prompts`;
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
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}/prompts`])),
        'x-default': `/${routing.defaultLocale}/prompts`,
      },
    },
  };
}

async function page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    tags?: string;
    sort?: string;
  }>;
}) {
  const t = await getTranslations('Pages.MyPrompts');
  const params = await searchParams;

  const promptsParams = {
    page: params.page || '1',
    tags: params.tags && params.tags !== 'undefined' ? params.tags : '',
    search: params.search && params.search !== 'undefined' ? params.search : '',
    sort: params.sort && params.sort !== 'undefined' ? params.sort : '',
    forApi: 'prompts',
    limit: 24,
    status: 'True',
  } as const;

  return (
    <PrefetchBoundary prefetchers={[prefetchPrompts(promptsParams)]}>
      <section>
        <ShowPromptsContainer head={t('head')} />
      </section>
    </PrefetchBoundary>
  );
}

export default page;
