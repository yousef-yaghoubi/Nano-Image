import { DataType, PromptType } from '@/types/data';

export type PromptsApi = 'prompts' | 'favorites' | 'get-me/prompts';

export interface FetchPromptsParams {
  page?: string;
  tags?: string;
  search?: string;
  sort?: string;
  forApi?: PromptsApi;
  limit?: number;
  isPublic?: 'True' | 'False' | 'Pending';
}

export type PromptsResponse = DataType<PromptType[]>;

export interface MyPromptsResponse {
  success: boolean;
  message?: string;
  data: (PromptType & { buttons: string })[];
  allCount?: number;
  totalCount?: number;
  pagination?: {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

function buildPromptsUrl(params: FetchPromptsParams) {
  const {
    page = '1',
    tags,
    search,
    sort,
    forApi = 'prompts',
    limit = 24,
    isPublic,
  } = params;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    page,
    ...(isPublic && { isPublic }),
    ...(search && { search }),
    ...(tags && { tags }),
    ...(sort && { sort }),
  });

  return `/api/${forApi}?${searchParams.toString()}`;
}

export async function fetchPrompts<T = PromptsResponse>(
  params: FetchPromptsParams
): Promise<T> {
  const res = await fetch(buildPromptsUrl(params));

  if (!res.ok) {
    throw new Error(`Failed to fetch prompts: ${res.statusText}`);
  }

  return res.json();
}

export async function deletePrompt(promptId: string) {
  const res = await fetch('/api/prompts', {
    method: 'DELETE',
    body: JSON.stringify({ promptId }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete prompt');
  }

  return data;
}
