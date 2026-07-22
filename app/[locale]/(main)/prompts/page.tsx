import ShowPromptsContainer from '@/components/shared/Prompts/ShowPromptsContainer';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';

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
        ...Object.fromEntries(
          routing.locales.map((l) => [l, `/${l}/prompts`])
        ),
        'x-default': `/${routing.defaultLocale}/prompts`,
      },
    },
  };
}

async function page() {
  const t = await getTranslations('Pages.MyPrompts');

  return (
    <section>
      <ShowPromptsContainer head={t('head')} />
    </section>
  );
}

export default page;
