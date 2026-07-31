import { describe, it, expect, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { prefetchPrompts, prefetchQuantities } from '@/lib/query-prefetch';

describe('query-prefetch', () => {
  it('prefetchQuantities uses the quantities query key', async () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'prefetchQuery');

    await prefetchQuantities(queryClient);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['quantities'] })
    );
  });

  it('prefetchPrompts uses the prompts list query key with params', async () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'prefetchQuery');
    const params = {
      page: '1',
      search: 'cyberpunk',
      limit: 12,
      status: 'True',
    } as const;

    await prefetchPrompts(params)(queryClient);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['prompts', 'list', params],
      })
    );
  });

  it('prefetchPrompts returns a function accepting the query client', () => {
    const prefetcher = prefetchPrompts({ limit: 24 });
    expect(typeof prefetcher).toBe('function');
  });
});
