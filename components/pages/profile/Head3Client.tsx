'use client';
import { MotionH3 } from '@/components/shared/MotionWarpper';
import { useParams } from 'next/dist/client/components/navigation';

function Head3Client({ title }: { title: string }) {
  const params = useParams();

  return (
    <MotionH3
      initial={{
        x: params.locale == 'en' ? -100 : 100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.8 },
      }}
      className="heading-3 text-primary mb-3"
    >
      {title}
    </MotionH3>
  );
}

export default Head3Client;
