import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

import type { LaunchFilm } from "./types";

export async function getLaunchFilms(): Promise<LaunchFilm[]> {
  const response = await API<ApiResponse<LaunchFilm[]>>("/launch-films", METHODS.GET);

  return getApiResponseData(response, "Unable to load launch films.");
}
