import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/redux/slices/auth/types";

type LoginResponse = ApiResponse<{ user: User; token: string }>;

export const loginAPI = (data: { email: string; password: string }) => {
  return api.post<LoginResponse>("/auth/login", data);
};

export const logoutAPI = () => {
  return api.post("/auth/logout");
};

export const forgotPasswordAPI = (email: string) => {
  return api.post<ApiResponse>("/auth/forgot-password", {
    email,
  });
};

export const resetPasswordAPI = async (
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
) => {
  const response = await api.post<ApiResponse>("/auth/reset-password", {
    token,
    email,
    password,
    password_confirmation,
  });

  return response.data;
};
