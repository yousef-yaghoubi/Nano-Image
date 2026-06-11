'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchQuantities } from '@/services/quantities';

export default function useQuantities() {
  return useQuery({
    queryKey: queryKeys.quantities.all,
    queryFn: fetchQuantities,
  });
}
