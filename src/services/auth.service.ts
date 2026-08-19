import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { AuthSession, LoginCredentials } from "@/types/auth";

const post = async <T>(path: string, payload?: unknown) =>
  (await api.post<ApiResponse<T>>(path, payload)).data;

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await post<AuthSession>("/auth/login", credentials);

    if (!response.status || !response.data?.token || !response.data.user) {
      throw new Error(response.message || "Unable to sign in.");
    }

    return response.data;
  },
  logout: () => post<null>("/auth/logout"),
  forgotPassword: (email: string) => post<null>("/auth/forgot-password", { email }),
  resetPassword: (payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => post<null>("/auth/reset-password", payload),
};
