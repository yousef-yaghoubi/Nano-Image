import { ReactNode } from 'react';

export interface SlideContent {
  id?: string | number;
  title?: string;
  image?: string;
  text?: string | ReactNode;
  customContent?: ReactNode;
  imageAlt?: string;
  imageSizes?: string;
  imagePriority?: boolean;
  imageClassName?: string;
  className?: string;
  showSpotlight?: boolean;
  showGradient?: boolean;
}

export interface EmblaSliderProps {
  slides: SlideContent[];
  autoplayDelay?: number;
  autoplayStopOnInteraction?: boolean;
  loop?: boolean;
  aspectRatio?: string | false;
  containerClassName?: string;
  slideClassName?: string;
  enableFade?: boolean;
  slidesPerView?: number;
  slidesPerViewMobile?: number;
  slidesPerViewTablet?: number;
  slidesPerViewDesktop?: number;
  minSlideWidth?: number;
  autoResponsive?: boolean;
}

export interface EmblaSlideProps {
  slide: SlideContent;
  slideClassName?: string;
  slideWidth?: string;
  isMultipleSlides: boolean;
  currentSlidesPerView: number;
}

export interface SlideTextProps {
  text: string | ReactNode;
  hasImage: boolean;
  textSizeClass: string;
  paddingClass: string;
  isMultiple: boolean;
}
