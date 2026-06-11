'use client';

import { motion } from 'motion/react';
import { ElementType, PropsWithChildren } from 'react';

const createMotion = <T extends ElementType>(Tag: T) => {
  const Component = ({
    children,
    className,
    ...rest
  }: PropsWithChildren<{ className?: string; [key: string]: unknown }>) => {
    const TagComponent = Tag as ElementType;
    return (
      <TagComponent className={className} {...rest}>
        {children}
      </TagComponent>
    );
  };
  Component.displayName = `Motion(${typeof Tag === 'string' ? Tag : Tag.displayName || Tag.name || 'Component'})`;
  return Component;
};

export const MotionDiv = createMotion(motion.div);
export const MotionButton = createMotion(motion.button);
export const MotionSpan = createMotion(motion.span);
export const MotionP = createMotion(motion.p);
export const MotionH1 = createMotion(motion.h1);
