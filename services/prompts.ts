import { getBaseUrl } from '@/lib/baseUrl';
import { DataType, PromptType } from '@/types/data';

export type PromptsApi = 'prompts' | 'favorites' | 'get-me/prompts';

export interface FetchPromptsParams {
  page?: string;
  tags?: string;
  search?: string;
  sort?: string;
  forApi?: PromptsApi;
  limit?: number;
  status?: 'True' | 'False' | 'Pending';
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
    status,
  } = params;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    page,
    ...(status && { status }),
    ...(search && { search }),
    ...(tags && { tags }),
    ...(sort && { sort }),
  });

  return `${getBaseUrl()}/api/${forApi}?${searchParams.toString()}`;
}

export async function fetchPrompts<T = PromptsResponse>(
  params: FetchPromptsParams
): Promise<T> {
  // const {} =
  const res = await fetch(buildPromptsUrl(params));

  if (!res.ok) {
    throw new Error('generic');
  }

  return res.json();
}
