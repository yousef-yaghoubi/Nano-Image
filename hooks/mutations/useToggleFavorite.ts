'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddToFavorite } from '@/app/[locale]/actions/AddToFavorite';
import { queryKeys } from '@/lib/query-keys';
import { ObjectId } from 'mongoose';

export default function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promptId }: { promptId: ObjectId }) =>
      AddToFavorite({ promptId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prompts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quantities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.overview });
    },
  });
}
