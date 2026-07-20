import { SlideContent } from '@/types/slider';
import Image from 'next/image';
import React from 'react';

const DEFAULTS = {
  IMAGE_SIZES: '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 500px',
  IMAGE_CLASSNAME: 'object-cover z-40',
  MIN_SLIDE_WIDTH: 120,
  AUTOPLAY_DELAY: 5000,
} as const;

interface ImageOptions {
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'auto';
}
interface SlideImageProps {
  slide: SlideContent;
  options?: ImageOptions;
}
const SlideImage: React.FC<SlideImageProps> = ({ slide, options }) => {
  const {
    image,
    imageAlt,
    title,
    imageSizes = DEFAULTS.IMAGE_SIZES,
    imageClassName = DEFAULTS.IMAGE_CLASSNAME,
    showSpotlight = true,
    showGradient = true,
  } = slide;

  if (!image) return null;

  return (
    <>
      <Image
        src={image}
        alt={imageAlt || title || 'Slide image'}
        fill
        className={imageClassName}
        sizes={imageSizes}
        priority={options?.priority}
        loading={options?.loading}
        fetchPriority={options?.fetchPriority}
      />

      {showSpotlight && (
        <div className="spotlight-container absolute inset-0 z-50 h-full w-full" />
      )}
      {showGradient && (
        <div className="gradientImage absolute inset-0 z-50 h-full w-full" />
      )}
    </>
  );
};

export default SlideImage;
