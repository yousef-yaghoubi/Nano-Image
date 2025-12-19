'use client';
import { motion } from 'motion/react';
import { useParams } from 'next/navigation';

function HeadPages({ title }: { title: string }) {
  const params = useParams() as { locale: string };

  return (
    <motion.h1
      initial={{
        x: params.locale == 'en' ? -100 : 100,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
        transition: { duration: 0.8 },
      }}
      className="heading-1 mb-4"
    >
      {title}
    </motion.h1>
  );
}

export default HeadPages;
