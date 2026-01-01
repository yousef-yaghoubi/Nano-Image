import { EmblaSliderProps } from '@/types/slider';
import { useMediaQuery } from './useMediaQuery';
import { useMemo } from 'react';

const BREAKPOINTS = {
  MOBILE_MAX: '(max-width: 640px)',
  TABLET: '(min-width: 641px) and (max-width: 1024px)',
  DESKTOP_MIN: '(min-width: 1025px)',
} as const;

const DEFAULTS = {
  IMAGE_SIZES: '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 500px',
  IMAGE_CLASSNAME: 'object-cover z-40',
  MIN_SLIDE_WIDTH: 120,
  AUTOPLAY_DELAY: 5000,
} as const;

export const useResponsiveSlidesPerView = (
  props: Pick<
    EmblaSliderProps,
    | 'autoResponsive'
    | 'minSlideWidth'
    | 'slidesPerView'
    | 'slidesPerViewMobile'
    | 'slidesPerViewTablet'
    | 'slidesPerViewDesktop'
  >,
  containerWidth: number,
  totalSlides: number
) => {
  const isMobile = useMediaQuery(BREAKPOINTS.MOBILE_MAX);
  const isTablet = useMediaQuery(BREAKPOINTS.TABLET);
  const isDesktop = useMediaQuery(BREAKPOINTS.DESKTOP_MIN);

  return useMemo(() => {
    const {
      autoResponsive,
      minSlideWidth = DEFAULTS.MIN_SLIDE_WIDTH,
      slidesPerView = 1,
      slidesPerViewMobile,
      slidesPerViewTablet,
      slidesPerViewDesktop,
    } = props;

    if (autoResponsive && containerWidth > 0) {
      const count = Math.floor(containerWidth / minSlideWidth);
      return Math.max(1, Math.min(count, totalSlides));
    }
    if (slidesPerViewMobile !== undefined && isMobile)
      return slidesPerViewMobile;
    if (slidesPerViewTablet !== undefined && isTablet)
      return slidesPerViewTablet;
    if (slidesPerViewDesktop !== undefined && isDesktop)
      return slidesPerViewDesktop;
    return slidesPerView;
  }, [props, containerWidth, totalSlides, isMobile, isTablet, isDesktop]);
};
