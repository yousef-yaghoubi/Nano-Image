'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { EditPrompt } from '@/app/[locale]/actions/EditPrompt';

interface EditPromptInput {
  clerkId: string;
  prompt: {
    title?: string;
    prompt?: string;
    id: string;
  };
}

export default function useEditPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EditPromptInput) => EditPrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
    },
  });
}
