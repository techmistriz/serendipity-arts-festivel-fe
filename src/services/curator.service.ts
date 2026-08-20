import API, { METHODS } from "@/network/API";
import type { Curator, CuratorsResponse } from "@/types/curator";

export async function getCurators(limit?: number): Promise<Curator[]> {
  const response = await API<CuratorsResponse>(
    "/curators",
    METHODS.GET,
    limit ? { limit } : undefined,
  );

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch curators");
  }

  return response.data || [];
}