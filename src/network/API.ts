import axios, { type Method } from "axios";

import { store } from "@/redux/store";
import { siteConfig } from "@/config/site";

const baseURL = siteConfig.api_base_url?.replace(/\/$/, "");

export const METHODS = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export type ApiMethod = (typeof METHODS)[keyof typeof METHODS];

function getHeaders(payload: unknown, authToken: string | null) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  return {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

function clearUserToken() {
  if (typeof window === "undefined" || !store.getState().auth.accessToken) return;

  window.dispatchEvent(new Event("blaksand:session-expired"));
}

export default async function API<T>(
  endpoint: string,
  method: ApiMethod,
  payload?: unknown,
  authToken = store.getState().auth.accessToken,
): Promise<T> {
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  try {
    const response = await axios.request<T>({
      method: method as Method,
      url: `${baseURL}${endpoint}`,
      headers: getHeaders(payload, authToken),
      ...(method === METHODS.GET ? {} : { data: payload }),
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearUserToken();
    }

    throw error;
  }
}
