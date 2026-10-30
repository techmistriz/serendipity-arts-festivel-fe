import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { SupportEnquiryPayload } from "@/types/support.types";
import { getApiResponseData } from "@/utils/api";

export async function sendSupportEnquiry(data: SupportEnquiryPayload): Promise<void> {
  const response = await API<ApiResponse<unknown>>("/support-enquiry", METHODS.POST, data);
  getApiResponseData(response, "Unable to send your enquiry. Please try again.");
}
