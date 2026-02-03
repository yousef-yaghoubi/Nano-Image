import getQuantityes from '@/services/getQuantityes';
import { Counter } from './Counter';
import { DataType } from '@/types/data';
import { getTranslations } from 'next-intl/server';

async function ParentCounter() {
  const quantityes = (await getQuantityes()) as DataType<{
    prompts: number;
    likes: number;
  }>;

  const tBadges = await getTranslations('Pages.Home.Badges');

  return (
    <div className="flex justify-around items-center backgroundSecond p-2 md:p-5 border border-gray-300 dark:border-gray-700 rounded-3xl">
      <Counter count={quantityes.data.prompts} title={tBadges('prompts')} />
      <Counter count={30} title={tBadges('tags')} />
      <Counter count={quantityes.data.likes} title={tBadges('likes')} />
    </div>
  );
}

export default ParentCounter;
