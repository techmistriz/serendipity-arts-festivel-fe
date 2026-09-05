import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { VenueDetail, VenueListItem } from "@/types/venue";
import { getApiResponseData } from "@/utils/api";

export async function getVenues(limit?: number): Promise<VenueListItem[]> {
  const response = await API<ApiResponse<VenueListItem[]>>(
    "/venues",
    METHODS.GET,
    limit ? { limit } : undefined,
  );

  return getApiResponseData(response, "Unable to fetch venues.");
}

export async function getVenueDetail(id: number | string): Promise<VenueDetail> {
  const response = await API<ApiResponse<VenueDetail>>(
    `/venue-detail/${encodeURIComponent(String(id))}`,
    METHODS.GET,
  );

  return getApiResponseData(response, "Unable to fetch venue details.");
}
