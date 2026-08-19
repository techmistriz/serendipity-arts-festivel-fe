import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { AuthSession, LoginCredentials } from "@/types/auth";
import { getApiResponseData } from "@/utils/api";

const post = async <T>(path: string, payload?: unknown) =>
  (await api.post<ApiResponse<T>>(path, payload)).data;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!isRecord(value) || !isRecord(value.user)) return false;

  const user = value.user;

  return (
    typeof value.token === "string" &&
    value.token.length > 0 &&
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.email === "string"
  );
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await post<unknown>("/auth/login", credentials);
    const session = getApiResponseData(response, "Unable to sign in.");

    if (!isAuthSession(session)) {
      throw new Error("The server returned an invalid sign-in response.");
    }

    return session;
  },
  async logout(): Promise<void> {
    getApiResponseData(await post<null>("/auth/logout"), "Unable to sign out.");
  },
  async forgotPassword(email: string): Promise<void> {
    getApiResponseData(
      await post<null>("/auth/forgot-password", { email }),
      "Unable to send a reset link.",
    );
  },
  async resetPassword(payload: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<void> {
    getApiResponseData(
      await post<null>("/auth/reset-password", payload),
      "Unable to reset your password.",
    );
  },
};
