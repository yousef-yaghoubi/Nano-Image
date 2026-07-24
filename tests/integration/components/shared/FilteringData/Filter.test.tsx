import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FilterSort } from '@/components/shared/FilteringData/Filter';

const stableSearchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => '/en/prompts',
  useSearchParams: () => stableSearchParams,
  useParams: () => ({ locale: 'en' }),
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true,
}));

vi.mock('@/components/shared/DrawerDialog', () => ({
  DrawerDialog: ({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) => (
    <div>
      {trigger}
      <div data-testid="drawer-content">{children}</div>
    </div>
  ),
}));

describe('FilterSort', () => {
  it('renders filter button', async () => {
    render(<FilterSort />);
    await waitFor(() => {
      expect(screen.getByLabelText('Open filters')).toBeInTheDocument();
    });
  });

  it('renders sort dropdown', async () => {
    render(<FilterSort />);
    await waitFor(() => {
      expect(screen.getByLabelText('Sort options')).toBeInTheDocument();
    });
  });
});
