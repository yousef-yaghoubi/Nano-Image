import { SlideContent } from '@/types/slider';
import Image from 'next/image';
import React from 'react';

const DEFAULTS = {
  IMAGE_SIZES: '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 500px',
  IMAGE_CLASSNAME: 'object-cover z-40',
  MIN_SLIDE_WIDTH: 120,
  AUTOPLAY_DELAY: 5000,
} as const;

const SlideImage: React.FC<{ slide: SlideContent }> = ({ slide }) => {
  const {
    image,
    imageAlt,
    title,
    imageSizes = DEFAULTS.IMAGE_SIZES,
    imagePriority = false,
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
        priority={imagePriority}
      />
      {showSpotlight && (
        <div className="w-full h-full absolute inset-0 z-50 spotlight-container" />
      )}
      {showGradient && (
        <div className="w-full h-full absolute inset-0 z-50 gradientImage" />
      )}
    </>
  );
};

export default SlideImage;
