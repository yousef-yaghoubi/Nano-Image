import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ObjectId } from 'mongoose';
import { FavoriteButton } from '@/components/shared/Card/FavoriteButton';

const mockMutate = vi.fn();
vi.mock('@/hooks/mutations/useToggleFavorite', () => ({
  default: () => ({ mutate: mockMutate }),
}));

const mockId = '507f1f77bcf86cd799439011' as unknown as ObjectId;

describe('FavoriteButton', () => {
  it('renders like count', () => {
    render(
      <FavoriteButton promptId={mockId} promptIsFavorit={false} likes={42} />
    );
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders as a button', () => {
    render(
      <FavoriteButton promptId={mockId} promptIsFavorit={false} likes={42} />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders with specific text for likes count', () => {
    render(
      <FavoriteButton promptId={mockId} promptIsFavorit={true} likes={99} />
    );
    expect(screen.getByText('99')).toBeInTheDocument();
  });
});
