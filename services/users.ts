import { getBaseUrl } from '@/lib/baseUrl';
import { DataType, PromptType, UserType } from '@/types/data';

// export type PromptsApi = 'prompts' | 'favorites' | 'get-me/prompts';

export interface FetchUsersParams {
  page?: string;
  search?: string;
  sort?: string;
  //   forApi?: PromptsApi;
  limit?: number;
  role?: 'ADMIN' | 'MEMBER' | 'SUPER_ADMIN';
}

export type usersResponse = DataType<UserType[]>;

export interface MyUsersResponse {
  success: boolean;
  message?: string;
  data: (UserType & { buttons: string })[];
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

function buildUsersUrl(params: FetchUsersParams) {
  const {
    page = '1',
    // tags,
    search,
    sort,
    // forApi = 'users',
    limit = 24,
    role,
    // status,
  } = params;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    page,
    ...(role && { role }),
    ...(search && { search }),
    // ...(tags && { tags }),
    ...(sort && { sort }),
  });

  return `${getBaseUrl()}/api/users?${searchParams.toString()}`;
}

export async function fetchUsers<T = usersResponse>(
  params: FetchUsersParams
): Promise<T> {
  // const {} =
  const res = await fetch(buildUsersUrl(params), {
    // headers: {
    //   cookie: cookies().toString(),
    // },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  return res.json();
}

// export async function deletePrompt(promptId: string) {
//   const res = await fetch('/api/users', {
//     method: 'DELETE',
//     body: JSON.stringify({ promptId }),
//   });

//   const data = await res.json();

//   if (!res.ok || !data.success) {
//     throw new Error(data.message || 'Failed to delete prompt');
//   }

//   return data;
// }
