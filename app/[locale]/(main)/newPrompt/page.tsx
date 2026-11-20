import dynamic from 'next/dynamic';
import NotAuthenticated from '@/components/shared/Auth/NotAuthenticated';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

const SendPrompt = dynamic(() => import('@/components/shared/SendPrompt'));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'SEO.newPrompt' });

  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `/${locale}/newPrompt`,
    },
  };
}

async function page() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return <NotAuthenticated />;
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <SendPrompt />
    </MotionDiv>
  );
}

export default page;
