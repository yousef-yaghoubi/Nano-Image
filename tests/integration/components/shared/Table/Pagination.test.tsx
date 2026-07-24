import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/shared/Table/Pagination';

describe('Pagination', () => {
  it('returns null when totalPages is 0', () => {
    const { container } = render(
      <Pagination
        page={1}
        limit={10}
        totalCount={0}
        changeByUrl={false}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page info', () => {
    render(
      <Pagination
        page={1}
        limit={10}
        totalCount={50}
        changeByUrl={false}
        onPageChange={vi.fn()}
        onLimitChange={vi.fn()}
      />
    );
    expect(screen.getByText('pageOf')).toBeInTheDocument();
  });

  it('calls onPageChange when clicking next', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        page={1}
        limit={10}
        totalCount={50}
        changeByUrl={false}
        onPageChange={onPageChange}
        onLimitChange={vi.fn()}
      />
    );
    const nextLink = screen.getByText('Next');
    await user.click(nextLink);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
