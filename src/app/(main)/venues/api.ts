import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

import type { VenueDetail, VenueListItem } from "./types";

export async function getVenues(): Promise<VenueListItem[]> {
  const response = await apiClient.get<ApiResponse<VenueListItem[]>>("/venues");

  return getApiResponseData(response.data, "Unable to fetch venues.");
}

export async function getVenueDetail(id: number): Promise<VenueDetail> {
  const response = await apiClient.get<ApiResponse<VenueDetail>>(`/venue-detail/${id}`);

  return getApiResponseData(response.data, "Unable to fetch venue details.");
}
