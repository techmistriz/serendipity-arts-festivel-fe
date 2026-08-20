import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

import type { VenueDetail, VenueListItem } from "./types";

export async function getVenues(): Promise<VenueListItem[]> {
  const response = await API<ApiResponse<VenueListItem[]>>("/venues", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch venues.");
}

export async function getVenueDetail(id: number): Promise<VenueDetail> {
  const response = await API<ApiResponse<VenueDetail>>(`/venue-detail/${id}`, METHODS.GET);

  return getApiResponseData(response, "Unable to fetch venue details.");
}
