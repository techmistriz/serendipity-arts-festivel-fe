import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { CuratorDetailData, CuratorListItem } from "@/types/curator";
import { getApiResponseData } from "@/utils/api";

export async function getCurators(limit?: number): Promise<CuratorListItem[]> {
  const response = await API<ApiResponse<CuratorListItem[]>>(
    "/curators",
    METHODS.GET,
    limit ? { limit } : undefined,
  );

  return getApiResponseData(response, "Unable to fetch curators.");
}

export async function getCuratorDetail(slug: string): Promise<CuratorDetailData> {
  const response = await API<ApiResponse<CuratorDetailData>>(
    `/curator/${encodeURIComponent(slug)}`,
    METHODS.GET,
  );

  return getApiResponseData(response, "Unable to fetch curator details.");
}
