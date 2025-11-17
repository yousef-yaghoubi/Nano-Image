import { getBaseUrl } from '@/lib/getBaseUrl';

export default async function getPrompts({
  page = '1',
  tags,
  search,
}: {
  page?: string;
  tags?: string;
  search?: string | undefined;
}) {
  const limit = 24;
  const api = `${getBaseUrl()}/api/prompts?limit=${limit}&page=${page}&search=${search}&tags=${tags}`;
  const data = await fetch(api).then((res) => res.json());
  return data;
}
