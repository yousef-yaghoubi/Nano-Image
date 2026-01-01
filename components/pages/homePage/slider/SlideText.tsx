import { SlideTextProps } from '@/types/slider';
import React from 'react';
import { classNames } from '../Slider';

const SlideText: React.FC<SlideTextProps> = ({
  text,
  hasImage,
  textSizeClass,
  paddingClass,
  isMultiple,
}) => {
  const textClass = hasImage
    ? classNames(textSizeClass, 'drop-shadow-lg font-medium leading-relaxed')
    : classNames(
        textSizeClass,
        isMultiple ? 'text-primary font-semibold' : 'font-medium',
        'leading-relaxed'
      );

  const wrapperClass = hasImage
    ? classNames(
        'w-full h-full absolute inset-0 z-50 flex items-center justify-center',
        paddingClass
      )
    : classNames(
        'w-full h-full flex items-center justify-center',
        paddingClass
      );

  return (
    <div className={wrapperClass}>
      <div className="text-center z-50 max-w-full">
        {typeof text === 'string' ? <p className={textClass}>{text}</p> : text}
      </div>
    </div>
  );
};

export default SlideText;
