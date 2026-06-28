import type { FetchPromptsParams } from '@/services/prompts';
import { FetchUsersParams } from '@/services/users';

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
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params: FetchUsersParams) =>
      [...queryKeys.users.lists(), params] as const,
  },
};
