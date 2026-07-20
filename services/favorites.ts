import { getBaseUrl } from '@/lib/baseUrl';

export async function fetchFavoriteIds(): Promise<{
  success: boolean;
  data: { promptIds: string[] };
}> {
  const res = await fetch(`${getBaseUrl()}/api/favorites/ids`);

  if (!res.ok) throw new Error('generic');

  return res.json();
}
