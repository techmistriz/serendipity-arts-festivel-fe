import type { Sponsors, SponsorsResponse } from "@/types/sponsor";
import API, { METHODS } from "@/network/API";

export async function getSponsors(limit?: number): Promise<Sponsors[]> {
  const response = await API<SponsorsResponse>("/sponsors", METHODS.GET, {
    ...(limit ? { limit } : {}),
    sponsor_type_id: 3,
  });

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch sponsors");
  }

  return response.data;
}
