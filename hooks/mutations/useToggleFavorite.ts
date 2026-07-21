'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddToFavorite } from '@/app/[locale]/actions/AddToFavorite';
import { queryKeys } from '@/lib/query-keys';
import type { ObjectId } from 'mongoose';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import type { PromptsResponse } from '@/services/prompts';

export default function useToggleFavorite() {
  const queryClient = useQueryClient();
  const tMessages = useTranslations('Messages');

  return useMutation({
    mutationFn: ({ promptId }: { promptId: ObjectId }) =>
      AddToFavorite({ promptId }),

    onMutate: async ({ promptId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.ids() });

      const previousFavorites = queryClient.getQueryData<{
        success: boolean;
        data: { promptIds: string[] };
      }>(queryKeys.favorites.ids());

      const previousPromptsLists = queryClient.getQueriesData<PromptsResponse>({
        queryKey: queryKeys.prompts.lists(),
      });

      const promptIdStr = String(promptId);
      const wasFavorited =
        previousFavorites?.data?.promptIds?.includes(promptIdStr) ?? false;
      const updateValue = wasFavorited ? -1 : 1;

      if (previousFavorites?.data?.promptIds) {
        queryClient.setQueryData(queryKeys.favorites.ids(), {
          ...previousFavorites,
          data: {
            promptIds: wasFavorited
              ? previousFavorites.data.promptIds.filter(
                  (id) => id !== promptIdStr
                )
              : [...previousFavorites.data.promptIds, promptIdStr],
          },
        });
      }

      previousPromptsLists.forEach(([queryKey, cache]) => {
        if (!cache?.data) return;
        queryClient.setQueryData(queryKey, {
          ...cache,
          data: cache.data.map((prompt) =>
            String(prompt._id) === promptIdStr
              ? { ...prompt, likes: prompt.likes + updateValue }
              : prompt
          ),
        });
      });

      return { previousFavorites, previousPromptsLists };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites.ids(),
          context.previousFavorites
        );
      }
      context?.previousPromptsLists?.forEach(([queryKey, cache]) => {
        if (cache !== undefined) {
          queryClient.setQueryData(queryKey, cache);
        }
      });
      toast.error(tMessages('generic'));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },

    mutationKey: [queryKeys.favorites.ids, 'toggleFavorite'],
  });
}
