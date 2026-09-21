import API, { METHODS } from "@/network/API";

import type { ApiResponse } from "@/types/api";
import type { Discipline } from "@/types/discipline";

import { getApiResponseData } from "@/utils/api";

export const getDisciplines = async (): Promise<Discipline[]> => {
  const response = await API<ApiResponse<Discipline[]>>("/disciplines", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch disciplines.");
};
