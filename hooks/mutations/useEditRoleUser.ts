'use client';

import { EditRoleUser } from '@/app/[locale]/actions/EditUser';
import { queryKeys } from '@/lib/query-keys';
import { EditRoleUserType } from '@/types/inputs/EditUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useEditRoleUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EditRoleUserType) => EditRoleUser(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
