import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TableSkeleton } from '@/components/shared/Table/TableSkeleton';

describe('TableSkeleton', () => {
  it('renders default number of rows', () => {
    const { container } = render(<TableSkeleton />);
    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBe(5);
  });

  it('renders specified number of rows', () => {
    const { container } = render(<TableSkeleton rows={3} />);
    const bodyRows = container.querySelectorAll('tbody tr');
    expect(bodyRows.length).toBe(3);
  });

  it('renders specified number of columns', () => {
    const { container } = render(<TableSkeleton Columns={4} />);
    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells.length).toBe(4);
  });

  it('shows heading skeleton when head is true', () => {
    const { container } = render(<TableSkeleton head />);
    const skeleton = container.querySelector('.h-8');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders pagination skeleton in footer', () => {
    const { container } = render(<TableSkeleton />);
    const footer = container.querySelector('tfoot');
    expect(footer).toBeInTheDocument();
  });
});
