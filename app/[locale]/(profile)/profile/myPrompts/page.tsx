import dynamic from 'next/dynamic';
import { MotionDiv } from '@/components/shared/MotionWarpper';

const PromptTableWrapper = dynamic(
  () => import('@/components/pages/profile/myPrompts/PromptTableWrapper')
);

async function page() {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full min-w-0">
        <PromptTableWrapper />
      </div>
    </MotionDiv>
  );
}

export default page;
