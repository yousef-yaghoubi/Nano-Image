'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import usePrompts from '@/hooks/queries/usePrompts';
import useFavoriteIds from '@/hooks/queries/useFavoriteIds';
import ShowPrompts from './ShowPrompts';
import type { PromptsApi } from '@/services/prompts';
import { DataType, PromptType } from '@/types/data';
import { useTranslations } from 'next-intl';

type ShowPromptsContainerProps = {
  gridClass?: string;
  showSimple?: boolean;
  head?: string;
  desc?: string;
  forApi?: PromptsApi;
  limit?: number;
};

function ShowPromptsContainer({
  gridClass = 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
  showSimple = false,
  head,
  desc,
  forApi = 'prompts',
  limit = 24,
}: ShowPromptsContainerProps) {
  const searchParams = useSearchParams();
  const tMessages = useTranslations('Messages');

  const page = searchParams.get('page') || '1';
  const search =
    searchParams.get('search') && searchParams.get('search') !== 'undefined'
      ? (searchParams.get('search') as string)
      : '';
  const tags =
    searchParams.get('tags') && searchParams.get('tags') !== 'undefined'
      ? (searchParams.get('tags') as string)
      : '';
  const sort =
    searchParams.get('sort') && searchParams.get('sort') !== 'undefined'
      ? (searchParams.get('sort') as string)
      : '';

  const { data: promptsData, isLoading, isError, error } = usePrompts<
    DataType<PromptType[]>
  >({
    page,
    tags,
    search,
    sort,
    forApi,
    limit,
    status: 'True',
  });

  const { data: favoriteIdsData } = useFavoriteIds();

  const favoriteIds = useMemo(() => {
    if (!favoriteIdsData?.data?.promptIds) return new Set<string>();
    return new Set(favoriteIdsData.data.promptIds);
  }, [favoriteIdsData]);

  const data = useMemo(() => {
    if (!promptsData?.data) return promptsData;
    return {
      ...promptsData,
      data: promptsData.data.map((p) => ({
        ...p,
        isFavorited: favoriteIds.has(String(p._id)),
      })),
    };
  }, [promptsData, favoriteIds]);

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        {tMessages(error?.message) ||
          (data?.message && tMessages(data?.message)) ||
          'Failed to load prompts'}
      </p>
    );
  }

  return (
    <ShowPrompts
      isLoading={isLoading}
      prompt={data}
      desc={desc}
      head={head}
      showSimple={showSimple}
      gridClass={gridClass}
    />
  );
}

export default ShowPromptsContainer;
