import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchPrompts, type FetchPromptsParams } from '@/services/prompts';
import { fetchQuantities } from '@/services/quantities';

export type Prefetcher = (queryClient: QueryClient) => Promise<unknown>;

export const prefetchQuantities: Prefetcher = (queryClient) =>
  queryClient.prefetchQuery({
    queryKey: queryKeys.quantities.all,
    queryFn: fetchQuantities,
  });

export const prefetchPrompts =
  (params: FetchPromptsParams): Prefetcher =>
  (queryClient) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.prompts.list(params),
      queryFn: () => fetchPrompts(params),
    });
