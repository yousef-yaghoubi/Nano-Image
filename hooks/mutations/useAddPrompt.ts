'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPrompt } from '@/app/[locale]/actions/AddPrompt';
import { queryKeys } from '@/lib/query-keys';

interface AddPromptInput {
  clerkId: string;
  prompt: {
    title: string;
    prompt: string;
    image: string;
    tags?: string[];
  };
}

export default function useAddPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddPromptInput) => AddPrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
    },
  });
}
