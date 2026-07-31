import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  MotionDiv,
  MotionButton,
  MotionSpan,
  MotionP,
  fadeUp,
  fadeIn,
} from '@/components/shared/MotionWarpper';

describe('MotionWarpper', () => {
  it('MotionDiv renders children', () => {
    render(<MotionDiv>Hello World</MotionDiv>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('MotionDiv accepts className', () => {
    render(<MotionDiv className="test-class">Content</MotionDiv>);
    expect(screen.getByText('Content').className).toContain('test-class');
  });

  it('MotionButton renders a button', () => {
    render(<MotionButton>Click</MotionButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('MotionSpan renders a span', () => {
    render(<MotionSpan>Text</MotionSpan>);
    const el = screen.getByText('Text');
    expect(el.tagName).toBe('SPAN');
  });

  it('MotionP renders a paragraph', () => {
    render(<MotionP>Paragraph</MotionP>);
    expect(screen.getByText('Paragraph').tagName).toBe('P');
  });

  it('fadeUp has correct initial values', () => {
    expect(fadeUp.initial).toEqual({ opacity: 0, y: 20 });
    expect(fadeUp.animate).toEqual({ opacity: 1, y: 0 });
  });

  it('fadeIn has correct initial values', () => {
    expect(fadeIn.initial).toEqual({ opacity: 0 });
    expect(fadeIn.animate).toEqual({ opacity: 1 });
  });
});
