import { getBaseUrl } from '@/lib/baseUrl';
import { DataType, UserType } from '@/types/data';

export interface FetchUsersParams {
  page?: string;
  search?: string;
  sort?: string;
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
  const { page = '1', search, sort, limit = 24, role } = params;

  const searchParams = new URLSearchParams({
    limit: String(limit),
    page,
    ...(role && { role }),
    ...(search && { search }),
    ...(sort && { sort }),
  });

  return `${getBaseUrl()}/api/users?${searchParams.toString()}`;
}

export async function fetchUsers<T = usersResponse>(
  params: FetchUsersParams
): Promise<T> {
  const res = await fetch(buildUsersUrl(params));

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  return res.json();
}
