import { getTranslations } from 'next-intl/server';
import { Counter } from './Counter';

async function ParentCounter() {
  const t = await getTranslations('Pages.Home.Badges');
  return (
    <div className="flex justify-around items-center backgroundSecond p-2 md:p-5 border border-gray-300 dark:border-gray-700 rounded-3xl">
      <Counter count={140} title={t('prompts')} />
      <Counter count={270} title={t('tags')} />
      <Counter count={40} title={t('likes')} />
    </div>
  );
}

export default ParentCounter;
