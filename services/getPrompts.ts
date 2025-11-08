"use server";

import { getBaseUrl } from "@/lib/getBaseUrl";

export default async function getPrompts({ page = "1" }: { page?: string }) {
  const limit = 24;
  const api = `${getBaseUrl()}/api/prompts?limit=${limit}&page=${page}`;
  const data = await fetch(api).then((res) => res.json());
  return data;
}
