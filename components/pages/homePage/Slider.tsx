'use client';

import React, { useMemo, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import Autoplay from 'embla-carousel-autoplay';
import { EmblaSliderProps, SlideContent } from '@/types/slider';
import { useContainerWidth } from '@/hooks/useContainerWidth';
import { useResponsiveSlidesPerView } from '@/hooks/useResponsiveSlidesPerView';
import { EmblaSlide } from './slider/EmblaSlide';

// ==== Default Config ====
const DEFAULTS = {
  IMAGE_SIZES: '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 500px',
  IMAGE_CLASSNAME: 'object-cover z-40',
  MIN_SLIDE_WIDTH: 120,
  AUTOPLAY_DELAY: 5000,
} as const;

// ==== Utils ====
export const classNames = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const getSlideKey = (slide: SlideContent, index: number) =>
  slide.id?.toString() || `${slide.title || 'slide'}-${index}`;

export const getPaddingClass = (slidesPerView: number) =>
  slidesPerView >= 3
    ? 'p-2 md:p-3'
    : slidesPerView === 2
      ? 'p-3 md:p-4'
      : 'p-6 md:p-8';

export const getTextSizeClass = (slidesPerView: number) =>
  slidesPerView >= 3
    ? 'text-sm md:text-base'
    : slidesPerView === 2
      ? 'text-base md:text-lg'
      : 'text-lg md:text-xl lg:text-2xl';

// ==== Slide Subcomponents ====

// ==== Main Component ====
const EmblaSlider: React.FC<EmblaSliderProps> = ({
  slides,
  autoplayDelay = DEFAULTS.AUTOPLAY_DELAY,
  autoplayStopOnInteraction = false,
  loop = true,
  aspectRatio = 'aspect-square',
  containerClassName = '',
  slideClassName = '',
  enableFade = true,
  slidesPerView = 1,
  slidesPerViewMobile,
  slidesPerViewTablet,
  slidesPerViewDesktop,
  minSlideWidth = DEFAULTS.MIN_SLIDE_WIDTH,
  autoResponsive = false,
}) => {
  const { containerRef, width: containerWidth } =
    useContainerWidth(autoResponsive);

  const currentSlidesPerView = useResponsiveSlidesPerView(
    {
      autoResponsive,
      minSlideWidth,
      slidesPerView,
      slidesPerViewMobile,
      slidesPerViewTablet,
      slidesPerViewDesktop,
    },
    containerWidth,
    slides.length
  );

  const plugins = useMemo(() => {
    const result: unknown[] = [];
    if (enableFade && currentSlidesPerView === 1) result.push(Fade());
    result.push(
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: autoplayStopOnInteraction,
      })
    );
    return result;
  }, [
    enableFade,
    currentSlidesPerView,
    autoplayDelay,
    autoplayStopOnInteraction,
  ]);

  const [emblaRef] = useEmblaCarousel(
    { loop, slidesToScroll: 1 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins as any // Fixes type error by asserting plugins as any
  );

  const slideWidth = useMemo(
    () =>
      currentSlidesPerView > 1 ? `${100 / currentSlidesPerView}%` : undefined,
    [currentSlidesPerView]
  );

  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      emblaRef(node);
      if (autoResponsive && node) containerRef.current = node;
    },
    [emblaRef, autoResponsive, containerRef]
  );

  return (
    <div
      ref={combinedRef}
      className={classNames('overflow-hidden select-none', containerClassName)}
      dir='ltr'
    >
      <div className={classNames('flex', aspectRatio !== false && aspectRatio)}>
        {slides.map((slide, idx) => (
          <EmblaSlide
            key={getSlideKey(slide, idx)}
            slide={slide}
            slideClassName={slideClassName}
            slideWidth={slideWidth}
            isMultipleSlides={currentSlidesPerView > 1}
            currentSlidesPerView={currentSlidesPerView}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaSlider;
