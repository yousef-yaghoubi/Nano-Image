'use client';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { FavoriteButton } from './FavoriteButton';
import { PromptType } from '@/types/data';
import { motion } from 'motion/react';

function Card({ data }: { data: PromptType }) {
  const t = useTranslations('Product');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.prompt);
    toast.success(t('toastCopy'));
  };

  return (
    <motion.div
      className="w-full md:w-72 h-52 sm:h-64 md:h-96 overflow-hidden bg-primary relative rounded-lg md:rounded-3xl rounded-tl-none! group"
      dir="ltr"
      initial={{
        y: 100,
        opacity: 0.5,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: { duration: 1 },
      }}
      viewport={{ once: true }}
    >
      <div className="z-50! left-0 w-20 absolute text-sm font-medium bg-white h-8 rounded-br-md flex justify-center items-center gap-2 likeBox">
        <span>{data.likes}</span>
        <FavoriteButton
          promptId={data._id}
          promptIsFavorit={data.isFavorited}
        />
      </div>
      <Image
        src={data.image}
        alt={data.title}
        loading="lazy"
        fill
        className="md:group-hover:scale-110 text-white flex justify-center items-center text-center md:group-hover:blur-sm transition duration-700 z-10 object-cover w-1/2! md:w-full!"
      />

      <div className="font-normal text-center text-white md:text-black md:bg-white rounded-sm text-sm h-fit md:text-lg left-1/2 md:left-0 top-3 md:top-auto right-2 w-fit max-w-1/2 md:max-w-4/5 mx-auto absolute bottom-4 md:-bottom-8 md:group-hover:bottom-4 transition-all duration-700 z-40 p-1 md:opacity-0 md:group-hover:opacity-85 md:shadow-[0_0_10px_white] m-auto">
        {data.title}
      </div>

      <button
        className="absolute flex items-center gap-2 z-40 md:top-0 bottom-4 md:bottom-0 left-1/2 h-fit font-medium text-lg p-1 px-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 cursor-pointer text-white rounded-sm m-auto md:left-0 right-0 w-fit bg-transparent border border-white"
        onClick={() => handleCopy()}
      > 
        <Copy size={15} />
        <span>{t('copy')}</span>
      </button>
    </motion.div>
  );
}

export default Card;
