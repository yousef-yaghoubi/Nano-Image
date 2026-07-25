import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ShowPrompts from '@/components/shared/Prompts/ShowPrompts';
import { mockPrompts } from '@/tests/helpers/data';

vi.mock('@/hooks/mutations/useToggleFavorite', () => ({
  default: () => ({ mutate: vi.fn() }),
}));

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

const mockPromptResponse = {
  prompts: mockPrompts.length,
  success: true,
  message: null,
  data: mockPrompts,
  pagination: {
    total: 3,
    totalPages: 1,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

describe('ShowPrompts', () => {
  it('shows loading skeletons when isLoading is true', () => {
    const { container } = render(<ShowPrompts isLoading cardCount={4} />);
    const skeleton = container.querySelector('[class*="animate"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders prompt cards when data is provided', () => {
    render(<ShowPrompts prompt={mockPromptResponse} />);
    expect(screen.getByText('Cinematic Sunset')).toBeInTheDocument();
  });

  it('renders head and description when provided', () => {
    render(
      <ShowPrompts
        head="Test Head"
        desc="Test Description"
        prompt={mockPromptResponse}
      />
    );
    expect(screen.getByText('Test Head')).toBeInTheDocument();
  });
});
