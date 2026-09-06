import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { Faq } from "@/types/faq";
import { getApiResponseData } from "@/utils/api";

export async function getFaqs(): Promise<Faq[]> {
  const response = await API<ApiResponse<Faq[]>>("/faq", METHODS.GET);

  return getApiResponseData(response, "Unable to fetch FAQs.");
}
