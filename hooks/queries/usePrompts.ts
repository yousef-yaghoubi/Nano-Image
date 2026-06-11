'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  fetchPrompts,
  type FetchPromptsParams,
} from '@/services/prompts';

export default function usePrompts<T = unknown>(params: FetchPromptsParams = {}) {
  return useQuery({
    queryKey: queryKeys.prompts.list(params),
    queryFn: () => fetchPrompts<T>(params),
  });
}
