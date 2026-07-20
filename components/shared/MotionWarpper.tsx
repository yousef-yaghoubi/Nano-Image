'use client';

import { motion } from 'motion/react';
import type { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMotionTag = (tag: any) => {
  const MotionTag = motion(tag);

  return function WrappedMotion({
    children,
    className,
    ...rest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: PropsWithChildren<Record<string, any>>) {
    return (
      <MotionTag className={className} {...rest}>
        {children}
      </MotionTag>
    );
  };
};

export const MotionDiv = createMotionTag('div');
export const MotionMain = createMotionTag('main');
export const MotionButton = createMotionTag('button');
export const MotionSpan = createMotionTag('span');
export const MotionP = createMotionTag('p');
export const MotionH1 = createMotionTag('h1');
export const MotionH3 = createMotionTag('h3');
export const MotionLi = createMotionTag('li');
export const MotionUl = createMotionTag('ul');

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const fadeLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const fadeRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
