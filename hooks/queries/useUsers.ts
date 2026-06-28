'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { fetchUsers, type FetchUsersParams } from '@/services/users';

export default function useUsers<T = unknown>(params: FetchUsersParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => fetchUsers<T>(params),
  });
}
