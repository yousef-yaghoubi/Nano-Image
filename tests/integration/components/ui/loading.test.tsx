import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Loading } from '@/components/ui/loading';

describe('Loading', () => {
  it('renders with default text', () => {
    render(<Loading />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loading text="custom.loading" />);
    expect(screen.getByText('custom.loading')).toBeInTheDocument();
  });

  it('applies fullScreen class when fullScreen is true', () => {
    const { container } = render(<Loading fullScreen />);
    const firstChild = container.firstChild as HTMLElement | null;
    expect(firstChild?.className).toContain('fixed');
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<Loading size="sm" />);
    const firstSvg = container.querySelector('svg') as SVGElement | null;
    expect(firstSvg?.getAttribute('class')).toContain('size-5');
    rerender(<Loading size="lg" />);
    const secondSvg = container.querySelector('svg') as SVGElement | null;
    expect(secondSvg?.getAttribute('class')).toContain('size-12');
  });
});
