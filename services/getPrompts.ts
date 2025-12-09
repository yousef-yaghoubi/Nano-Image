import { getBaseUrl } from '@/lib/getBaseUrl';
import { headers } from 'next/headers';

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

  const headersList = await headers();
  const cookie = headersList.get('cookie');

  const data = await fetch(api, {
    cache: 'no-store',
    headers: {
      Cookie: cookie || '',
    },
  }).then((res) => res.json());


  console.log(data)
  return data;
}
