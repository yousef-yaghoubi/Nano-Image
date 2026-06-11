import ParentCounterClient from './ParentCounterClient';
import { getTranslations } from 'next-intl/server';

async function ParentCounter() {
  const tBadges = await getTranslations('Pages.Home.Badges');

  return (
    <ParentCounterClient
      promptsLabel={tBadges('prompts')}
      tagsLabel={tBadges('tags')}
      likesLabel={tBadges('likes')}
    />
  );
}

export default ParentCounter;
