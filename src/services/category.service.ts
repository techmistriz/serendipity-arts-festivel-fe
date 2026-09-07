import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { Category } from "@/types/category";
import { getApiResponseData } from "@/utils/api";

export const getCategories = async (): Promise<Category[]> => {
  const response = await API<ApiResponse<Category[]>>("/categories", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch categories.");
};
