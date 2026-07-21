'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddPrompt, AddPromptsList } from '@/app/[locale]/actions/AddPrompt';
import { queryKeys } from '@/lib/query-keys';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Messages');
  return useMutation({
    mutationFn: (input: AddPromptInput) => AddPrompt(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });

      if (data.success) {
        toast.success(t(data.message));
      } else {
        toast.error(t(data.message));
      }
    },
  });
}

export function useAddPromptsList() {
  const queryClient = useQueryClient();
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: () => AddPromptsList(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
      if (data.success) {
        toast.success(
          tMessages(data.message, { length: data.inserted as number })
        );
      } else {
        toast.info(tMessages(data.message));
      }
    },
    onError: () => {
      toast.error(tMessages('generic'));
    },
  });
}
