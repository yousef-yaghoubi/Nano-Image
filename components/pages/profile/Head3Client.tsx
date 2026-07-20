'use client';
import { MotionH3 } from '@/components/shared/MotionWarpper';

function Head3Client({ title }: { title: string }) {
  return (
    <MotionH3
      className="heading-3 text-primary mb-3"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {title}
    </MotionH3>
  );
}

export default Head3Client;
