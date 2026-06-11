import { Suspense } from 'react';
import PromptTableWrapper from './PromptTableWrapper';
import { TableSkeleton } from '../../../../../components/shared/Table/TableSkeleton';
import HeadPage from '@/components/shared/Prompts/HeadPage';
import { getTranslations } from 'next-intl/server';

async function page() {
  const t = await getTranslations('Pages.MyPrompts');
  return (
    <div className="w-full min-w-0">
      <div className="w-full min-w-0 overflow-hidden">
        <HeadPage head={t('head')} />
        <Suspense fallback={<TableSkeleton head />}>
          <PromptTableWrapper />
        </Suspense>
      </div>
    </div>
  );
}

export default page;
