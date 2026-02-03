'use client';
import { useParams } from 'next/navigation';
import { MotionH1, MotionP } from '../MotionWarpper';

function HeadPage({ head, desc }: { head?: string; desc?: string }) {
  const params = useParams();
  return (
    <>
      {head && (
        <MotionH1
          initial={{
            x: params.locale == 'en' ? -100 : 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 },
          }}
          className="heading-1 mb-4 text-primary"
        >
          {head}
        </MotionH1>
      )}

      {desc && (
        <MotionP
          initial={{
            x: params.locale == 'en' ? -100 : 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: { duration: 0.8 },
          }}
          className="heading-5 mb-4"
        >
          {desc}
        </MotionP>
      )}
    </>
  );
}

export default HeadPage;
