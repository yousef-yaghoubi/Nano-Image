'use client';

import { RejectRoleRequest } from '@/app/[locale]/actions/EditUser';
import { queryKeys } from '@/lib/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useRejectRoleRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => RejectRoleRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
