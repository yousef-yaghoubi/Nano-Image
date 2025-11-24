import { getBaseUrl } from '@/lib/getBaseUrl';

export default async function getPrompts({
  page = '1',
  tags,
  search,
  sort,
}: {
  page?: string;
  tags?: string;
  search?: string | undefined;
  sort?: string;
}) {
  const limit = 24;
  const api = `${getBaseUrl()}/api/prompts?limit=${limit}&page=${page}${
    search ? `&search=${search}` : ''
  }${tags ? `&tags=${tags}` : ''}${sort ? `&sort=${sort}` : ''}`;
  const data = await fetch(api, { cache: 'no-store' }).then((res) =>
    res.json()
  );
  return data;
}
