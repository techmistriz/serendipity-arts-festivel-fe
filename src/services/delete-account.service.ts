import API, { METHODS } from "@/network/API";

import type { ApiResponse } from "@/types/api";

export const deleteAccount = async (): Promise<ApiResponse<unknown>> => {
  return API<ApiResponse<unknown>>("/delete-account", METHODS.DELETE);
};
