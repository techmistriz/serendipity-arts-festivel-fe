import "server-only";

import { siteConfig } from "@/config/site";
import type { ApiResponse } from "@/types/api";

import { getPublicApiHeaders } from "./api-headers";

type ServerApiOptions = {
  revalidate?: number;
  tags?: string[];
};

function getServerApiUrl(endpoint: string) {
  const baseUrl = siteConfig.api_base_url.replace(/\/$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${path}`;
}

/**
 * Fetch a public API response from a Server Component or metadata generator.
 * Returns null for failed HTTP requests and unsuccessful API response envelopes.
 */
export async function getServerApiData<T>(
  endpoint: string,
  { revalidate = 3600, tags }: ServerApiOptions = {},
): Promise<T | null> {
  try {
    const response = await fetch(getServerApiUrl(endpoint), {
      headers: getPublicApiHeaders(),
      next: { revalidate, tags },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ApiResponse<T>;

    return payload.status ? payload.data : null;
  } catch {
    return null;
  }
}
