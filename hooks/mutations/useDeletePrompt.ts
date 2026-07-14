'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePrompt } from '@/services/prompts';
import { queryKeys } from '@/lib/query-keys';

export default function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promptId: string) => deletePrompt(promptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
