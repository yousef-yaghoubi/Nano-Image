import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sort } from '@/components/shared/SortingData/Sort';

describe('Sort', () => {
  it('renders sort button with accessible label', () => {
    render(<Sort sortQuery="likes desc" setSortQuery={vi.fn()} />);
    expect(screen.getByLabelText('Sort options')).toBeInTheDocument();
  });

  it('renders current sort option text', () => {
    render(<Sort sortQuery="likes desc" setSortQuery={vi.fn()} />);
    const currentButtons = screen.getAllByText('likeDesc');
    expect(currentButtons.length).toBeGreaterThanOrEqual(1);
  });
});
