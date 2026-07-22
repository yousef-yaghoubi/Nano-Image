'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatePromptsStatusBulk } from '@/app/[locale]/actions/UpdatePromptsStatusBulk';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function useUpdatePromptsStatusBulk() {
  const queryClient = useQueryClient();
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: ({
      promptIds,
      value,
    }: {
      promptIds: string[];
      value: 'True' | 'False';
    }) => UpdatePromptsStatusBulk({ promptIds, value }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
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
