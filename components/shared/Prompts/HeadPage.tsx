'use client';

import { MotionH1, MotionP } from '@/components/shared/MotionWarpper';

function HeadPage({ head, desc }: { head: string; desc?: string }) {
  return (
    <>
      {head && (
        <MotionH1
          className="heading-1 text-primary mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {head}
        </MotionH1>
      )}

      {desc && (
        <MotionP
          className="heading-5 mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {desc}
        </MotionP>
      )}
    </>
  );
}

export default HeadPage;
