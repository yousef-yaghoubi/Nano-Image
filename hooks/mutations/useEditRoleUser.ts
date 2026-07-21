'use client';

import { EditRoleUser } from '@/app/[locale]/actions/EditUser';
import { queryKeys } from '@/lib/query-keys';
import { EditRoleUserType } from '@/types/inputs/EditUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function useEditRoleUser() {
  const queryClient = useQueryClient();
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: (input: EditRoleUserType) => EditRoleUser(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
      if (data.status) {
        toast.success(tMessages(data.message));
      } else {
        toast.error(tMessages(data.message));
      }
    },
    onError: () => {
      toast.error(tMessages('generic'));
    },
  });
}
