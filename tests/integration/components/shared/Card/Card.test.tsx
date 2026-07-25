import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '@/components/shared/Card/Card';
import { mockPrompts } from '@/tests/helpers/data';

vi.mock('@/hooks/mutations/useToggleFavorite', () => ({
  default: () => ({ mutate: vi.fn() }),
}));

describe('Card', () => {
  it('renders prompt title', () => {
    render(<Card data={mockPrompts[0]} />);
    expect(screen.getByText('Cinematic Sunset')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<Card data={mockPrompts[0]} />);
    const img = screen.getByAltText('Cinematic Sunset');
    expect(img).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(<Card data={mockPrompts[0]} />);
    expect(screen.getByText('copy')).toBeInTheDocument();
  });

  it('renders favorite button with like count', () => {
    render(<Card data={mockPrompts[0]} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
