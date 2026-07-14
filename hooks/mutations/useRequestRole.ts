'use client';

import { RequestRole } from '@/app/[locale]/actions/EditUser';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRequestRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => RequestRole(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
