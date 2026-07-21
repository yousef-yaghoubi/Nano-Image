'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeletePrompt } from '@/app/[locale]/actions/DeletePrompt';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function useDeletePrompt() {
  const queryClient = useQueryClient();
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: (promptId: string) => DeletePrompt({ promptId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
      if (data.success) {
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
