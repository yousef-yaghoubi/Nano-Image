import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilterState } from '@/hooks/useFilterState';

const mockReplace = vi.fn();
const searchParams = new URLSearchParams();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => '/en/prompts',
  useSearchParams: () => searchParams,
  useParams: () => ({ locale: 'en' }),
  notFound: () => { throw new Error('notFound called'); },
  redirect: () => { throw new Error('redirect called'); },
}));

describe('useFilterState', () => {
  it('returns initial filter state', () => {
    const { result } = renderHook(() => useFilterState());
    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedTags).toEqual([]);
    expect(result.current.sortQuery).toBe('likes desc');
    expect(result.current.activeFilters).toEqual([]);
  });

  it('toggles tags correctly', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.toggleTag('Cinematic'));
    expect(result.current.selectedTags).toContain('Cinematic');
    act(() => result.current.toggleTag('Cinematic'));
    expect(result.current.selectedTags).not.toContain('Cinematic');
  });

  it('sets search query', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.setSearchQuery('sunset'));
    expect(result.current.searchQuery).toBe('sunset');
  });

  it('sets sort query', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.setSortQuery('date asc'));
    expect(result.current.sortQuery).toBe('date asc');
  });

  it('clears all filters', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => {
      result.current.toggleTag('Cinematic');
      result.current.setSearchQuery('test');
    });
    act(() => result.current.clearAllFilters());
    expect(result.current.selectedTags).toEqual([]);
    expect(result.current.searchQuery).toBe('');
  });

  it('removes a tag filter', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.toggleTag('Cinematic'));
    act(() =>
      result.current.removeFilter({
        type: 'tag',
        value: 'Cinematic',
        displayValue: 'Cinematic',
      })
    );
    expect(result.current.selectedTags).not.toContain('Cinematic');
  });

  it('shows active filters for tags', () => {
    const { result } = renderHook(() => useFilterState());
    act(() => result.current.toggleTag('Cyberpunk'));
    expect(result.current.activeFilters.length).toBeGreaterThanOrEqual(1);
  });
});
