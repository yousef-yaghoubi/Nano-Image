import React from 'react';
import { EmblaSlideProps } from '@/types/slider';
import { classNames, getPaddingClass, getTextSizeClass } from '../Slider';
import SlideImage from './SlideImage';
import SlideText from './SlideText';

export const EmblaSlide: React.FC<EmblaSlideProps> = (props) => {
  const {
    slide,
    slideClassName,
    slideWidth,
    isMultipleSlides,
    currentSlidesPerView,
  } = props;

  const { text, customContent, className = '', image } = slide || {};
  const hasText = Boolean(text);
  const hasImage = Boolean(image);

  const paddingClass = getPaddingClass?.(currentSlidesPerView);
  const textSizeClass = getTextSizeClass(currentSlidesPerView);

  const widthStyle = slideWidth
    ? { flex: `0 0 ${slideWidth}`, minWidth: 0 }
    : undefined;

  return (
    <div
      className={classNames(
        !slideWidth && 'flex-[0_0_100%]',
        'relative h-full min-w-0',
        isMultipleSlides && 'px-1 sm:px-2',
        slideClassName
      )}
      style={widthStyle}
    >
      <div
        className={classNames(
          'relative h-full w-full overflow-hidden rounded-lg',
          className
        )}
      >
        <SlideImage slide={slide} />
        {hasText && (
          <SlideText
            text={text}
            hasImage={hasImage}
            textSizeClass={textSizeClass}
            paddingClass={paddingClass}
            isMultiple={isMultipleSlides}
          />
        )}
        {customContent && (
          <div className="absolute inset-0 z-50 h-full w-full">
            {customContent}
          </div>
        )}
      </div>
    </div>
  );
};
