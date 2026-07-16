import { getBaseUrl } from '@/lib/baseUrl';
import { DataType } from '@/types/data';

export interface QuantitiesData {
  prompts: number;
  likes: number;
}

export type QuantitiesResponse = DataType<QuantitiesData>;

export async function fetchQuantities(): Promise<QuantitiesResponse> {
  const res = await fetch(`${getBaseUrl()}/api/prompts/quantity`);

  if (!res.ok) {
    throw new Error(`Failed to fetch quantities: ${res.statusText}`);
  }

  return res.json();
}
