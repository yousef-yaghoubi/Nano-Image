import { Suspense } from 'react';
import PromptTableWrapper from './PromptTableWrapper';
import { TableSkeleton } from '../../../../../components/shared/Table/TableSkeleton';
import HeadPage from '@/components/shared/Prompts/HeadPage';
import { MotionDiv } from '@/components/shared/MotionWarpper';
import { getTranslations } from 'next-intl/server';

async function page() {
  const t = await getTranslations('Pages.MyPrompts');
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
    <div className="w-full min-w-0">
      <div className="w-full min-w-0 overflow-hidden">
        <HeadPage head={t('head')} />
        <Suspense fallback={<TableSkeleton head />}>
          <PromptTableWrapper />
        </Suspense>
      </div>
    </div>
    </MotionDiv>
  );
}

export default page;
