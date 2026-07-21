'use client';
import { Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { FavoriteButton } from './FavoriteButton';
import { PromptType } from '@/types/data';
import { MotionDiv } from '@/components/shared/MotionWarpper';

function Card({ data }: { data: PromptType }) {
  const t = useTranslations('Product');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data.prompt);
    toast.success(t('toastCopy'));
  };

  return (
    <MotionDiv
      className="bg-primary group relative h-52 w-full overflow-hidden rounded-lg rounded-tl-none! sm:h-64 md:h-96 md:w-72 md:rounded-3xl"
      dir="ltr"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="likeBox absolute left-0 z-20! flex h-8 w-20 items-center justify-center gap-2 rounded-br-md bg-white text-sm font-medium">
        <FavoriteButton
          promptId={data._id}
          promptIsFavorit={data.isFavorited ?? false}
          likes={data.likes}
        />
      </div>
      <Image
        src={data.image}
        alt={data.title}
        loading="lazy"
        fill
        className="z-10 flex w-1/2! items-center justify-center object-cover text-center text-white transition duration-700 md:w-full! md:group-hover:scale-110 md:group-hover:blur-sm"
      />

      <div className="absolute top-3 right-2 bottom-4 left-1/2 z-40 m-auto mx-auto h-fit w-fit max-w-1/2 rounded-sm p-1 text-center text-sm font-normal text-white transition-all duration-700 md:top-auto md:-bottom-8 md:left-0 md:max-w-4/5 md:bg-white md:text-lg md:text-black md:opacity-0 md:shadow-[0_0_10px_white] md:group-hover:bottom-4 md:group-hover:opacity-85">
        {data.title}
      </div>

      <button
        className="absolute right-0 bottom-4 left-1/2 z-40 m-auto flex h-fit w-fit cursor-pointer items-center gap-2 rounded-sm border border-white bg-transparent p-1 px-4 text-lg font-medium text-white transition-opacity duration-700 md:top-0 md:bottom-0 md:left-0 md:opacity-0 md:group-hover:opacity-100"
        onClick={() => handleCopy()}
      >
        <Copy size={15} />
        <span>{t('copy')}</span>
      </button>
    </MotionDiv>
  );
}

export default Card;
