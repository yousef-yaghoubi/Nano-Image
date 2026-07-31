import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { DrawerDialog } from '@/components/shared/DrawerDialog';

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true,
}));

describe('DrawerDialog', () => {
  it('renders title when provided', async () => {
    render(
      <DrawerDialog trigger={<span>Open</span>} title="Dialog Title">
        <div>Content</div>
      </DrawerDialog>
    );
    await waitFor(() => {
      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });
  });

  it('renders description when provided', async () => {
    render(
      <DrawerDialog
        trigger={<span>Open</span>}
        title="Title"
        desc="Description text"
      >
        <div>Content</div>
      </DrawerDialog>
    );
    await waitFor(() => {
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  it('renders children', async () => {
    render(
      <DrawerDialog trigger={<span>Open</span>} title="Title">
        <div>children content</div>
      </DrawerDialog>
    );
    await waitFor(() => {
      expect(screen.getByText('children content')).toBeInTheDocument();
    });
  });
});
