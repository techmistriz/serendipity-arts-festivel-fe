import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

import type { CuratorDetailData, CuratorListItem } from "./types";

export async function getCurators(signal?: AbortSignal): Promise<CuratorListItem[]> {
  const response = await apiClient.get<ApiResponse<CuratorListItem[]>>("/curators", { signal });

  return getApiResponseData(response.data, "Unable to fetch curators.");
}

export async function getCuratorDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<CuratorDetailData> {
  const response = await apiClient.get<ApiResponse<CuratorDetailData>>(
    `/curator/${encodeURIComponent(slug)}`,
    { signal },
  );

  return getApiResponseData(response.data, "Unable to fetch curator details.");
}
