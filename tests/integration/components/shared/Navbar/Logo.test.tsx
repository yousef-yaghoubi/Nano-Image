import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '@/components/shared/Navbar/Logo';

describe('Logo', () => {
  it('renders logo image', () => {
    render(<Logo />);
    const img = screen.getByAltText('NanoImage');
    expect(img).toBeInTheDocument();
  });

  it('renders word mark when prop is true', () => {
    render(<Logo wordMark />);
    expect(screen.getByText('Nano Image')).toBeInTheDocument();
  });

  it('does not render word mark by default', () => {
    render(<Logo />);
    expect(screen.queryByText('Nano Image')).not.toBeInTheDocument();
  });

  it('links to home page', () => {
    render(<Logo />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en');
  });
});
