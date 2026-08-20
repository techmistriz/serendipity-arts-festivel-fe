import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

import type { ContactFormData } from "./types";

export async function sendContactMessage(data: ContactFormData): Promise<void> {
  const response = await API<ApiResponse<null>>("/contact-us", METHODS.POST, data);

  getApiResponseData(response, "Unable to send your message.");
}
