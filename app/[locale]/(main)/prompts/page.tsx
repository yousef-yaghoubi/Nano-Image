import ShowPromptsContainer from '@/components/shared/Prompts/ShowPromptsContainer';
import { getTranslations } from 'next-intl/server';

async function page() {
  const t = await getTranslations('Pages.MyPrompts');

  return (
    <section>
      <ShowPromptsContainer head={t('head')} />
    </section>
  );
}

export default page;
