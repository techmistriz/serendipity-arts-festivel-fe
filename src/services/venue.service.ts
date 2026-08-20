import API, { METHODS } from "@/network/API";
import type { Venue, VenuesResponse } from "@/types/venue";

export async function getVenues(limit?: number): Promise<Venue[]> {
  const response = await API<VenuesResponse>(
    "/venues",
    METHODS.GET,
    limit ? { limit } : undefined,
  );

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch venues");
  }

  return response.data || [];
}