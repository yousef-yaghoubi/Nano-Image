'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchFavoriteIds } from '@/services/favorites';

export default function useFavoriteIds() {
  return useQuery({
    queryKey: queryKeys.favorites.ids(),
    queryFn: fetchFavoriteIds,
  });
}
