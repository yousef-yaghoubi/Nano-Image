import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import type { Prefetcher } from '@/lib/query-prefetch';
import type { ReactNode } from 'react';

export default async function PrefetchBoundary({
  prefetchers = [],
  children,
}: {
  prefetchers?: Prefetcher[];
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  await Promise.all(prefetchers.map((prefetch) => prefetch(queryClient)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
