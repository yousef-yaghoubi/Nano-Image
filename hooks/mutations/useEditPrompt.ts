'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import {
  EditPrompt,
  EditStatusPrompt,
} from '@/app/[locale]/actions/EditPrompt';
import {
  EditPromptType,
  EditStatusPromptType,
} from '@/types/inputs/EditPrompt';

export function useEditPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EditPromptType) => EditPrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}

export function useEditStatusPrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EditStatusPromptType) => EditStatusPrompt(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
