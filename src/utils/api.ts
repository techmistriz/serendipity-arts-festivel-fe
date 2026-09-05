import type { ApiResponse } from "@/types/api";

/**
 * Extracts data from the backend's standard response envelope and turns an
 * unsuccessful API response into an exception that page-level error UI can handle.
 */
export function getApiResponseData<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.status) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
}
