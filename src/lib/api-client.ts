import axios from "axios";

import { store } from "@/redux/store";
import { siteConfig } from "@/config/site";

/**
 * The application's single HTTP client for browser-to-backend API calls.
 *
 * Services import this instance so API configuration, Passport token handling,
 * and expired-session behaviour remain consistent everywhere.
 */
const apiClient = axios.create({
  baseURL: siteConfig.api_base_url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      Boolean(store.getState().auth.accessToken) &&
      typeof window !== "undefined"
    ) {
      window.dispatchEvent(new Event("saf:session-expired"));
    }
    return Promise.reject(error);
  },
);

export { apiClient };
export default apiClient;
