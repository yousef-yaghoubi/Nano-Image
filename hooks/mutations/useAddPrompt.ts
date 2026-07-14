'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPrompt, AddPromptsList } from '@/app/[locale]/actions/AddPrompt';
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

export function useAddPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AddPromptInput) => AddPrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}

export function useAddPromptsList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AddPromptsList(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
