import { getBaseUrl } from '@/lib/getBaseUrl';

export default async function getQuantityes() {
  const api = `${getBaseUrl()}/api/prompts/quantity`;

  const data = await fetch(api, {
    cache: 'no-store',
  }).then((res) => res.json());

  return data;
}
