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
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: (input: EditStatusPromptType) => EditStatusPrompt(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
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
