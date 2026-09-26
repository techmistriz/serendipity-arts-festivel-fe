import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { Vibe } from "@/types/vibe";
import { getApiResponseData } from "@/utils/api";

export async function getVibes(): Promise<Vibe[]> {
  const response = await API<ApiResponse<Vibe[]>>("/vibes", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch vibes.");
}
