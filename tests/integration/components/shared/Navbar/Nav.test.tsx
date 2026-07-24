import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavList from '@/components/shared/Navbar/Nav';

describe('NavList', () => {
  it('renders navigation links', () => {
    render(<NavList isDesktop />);
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('prompts')).toBeInTheDocument();
    expect(screen.getByText('newPrompt')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<NavList isDesktop />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });

  it('applies desktop layout class when isDesktop is true', () => {
    render(<NavList isDesktop />);
    const ul = screen.getByRole('list');
    expect(ul.className).toContain('flex-row');
  });

  it('applies mobile layout class when isDesktop is false', () => {
    render(<NavList isDesktop={false} />);
    const ul = screen.getByRole('list');
    expect(ul.className).toContain('flex-col');
  });
});
