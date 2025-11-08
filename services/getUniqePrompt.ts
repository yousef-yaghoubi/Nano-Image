import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function getUniqePrompt({ id }: { id: string }) {
  const api = `${getBaseUrl()}/api/prompts/uniqePrompt?id=${id}`;
  const data = await fetch(api).then((res) => res.json());

  return data.data;
}
