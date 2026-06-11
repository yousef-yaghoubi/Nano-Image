import type { FetchPromptsParams } from '@/services/prompts';

export const queryKeys = {
  prompts: {
    all: ['prompts'] as const,
    lists: () => [...queryKeys.prompts.all, 'list'] as const,
    list: (params: FetchPromptsParams) =>
      [...queryKeys.prompts.lists(), params] as const,
    detail: (id: string) => [...queryKeys.prompts.all, 'detail', id] as const,
  },
  quantities: {
    all: ['quantities'] as const,
  },
};
