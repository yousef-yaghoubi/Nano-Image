import { getBaseUrl } from '@/lib/baseUrl';
import { DataType } from '@/types/data';

export interface AdminOverviewData {
  totalPrompts: number;
  totalLikes: number;
  totalUsers: number;
  activePrompts: number;
  pendingPrompts: number;
  rejectedPrompts: number;
  adminRequests: number;
  membersCount: number;
  adminsCount: number;
  recentPrompts: {
    _id: string;
    title: string;
    likes: number;
    status: string;
    createdAt: string;
  }[];
  recentUsers: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    image?: string;
    createdAt: string;
  }[];
}

export type AdminOverviewResponse = DataType<AdminOverviewData>;

export async function fetchAdminOverview(): Promise<AdminOverviewResponse> {
  const res = await fetch(`${getBaseUrl()}/api/admin/overview`);

  if (!res.ok) {
    throw new Error(`Failed to fetch admin overview: ${res.statusText}`);
  }

  return res.json();
}
