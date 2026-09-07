import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { ProgramTag } from "@/types/program-tag";
import { getApiResponseData } from "@/utils/api";

export const getProgramTags = async (): Promise<ProgramTag[]> => {
  const response = await API<ApiResponse<ProgramTag[]>>("/program-tags", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch program tags.");
};
