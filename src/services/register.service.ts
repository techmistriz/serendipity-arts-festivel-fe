import {
  SendOTPRequest,
  GeneralRegisterRequest,
  GuestRegisterRequest,
  SEARequest,
} from "@/types/auth";
import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export const sendOTP = (data: SendOTPRequest) => {
  return api.post<ApiResponse>("/auth/send-otp", data);
};

export const registerUser = (data: GeneralRegisterRequest) => {
  return api.post<ApiResponse>("/auth/register", data);
};

export const registerVIP = (data: GuestRegisterRequest) => {
  return api.post<ApiResponse>("/auth/vip-register", data);
};

export const registerSEA = (data: SEARequest) => {
  // Assuming SEA uses the same endpoint as general but with different fields
  return api.post<ApiResponse>("/auth/sea-delegate-register", data);
};

export interface ArchiveUserPayload {
  email: string;
  role_id: number;
}

export const archiveUser = (data: ArchiveUserPayload) => {
  return api.post<ApiResponse<ArchivedUser>>("/auth/archive-user", data);
};

export interface ArchivedUser {
  id: number;
  email: string;
  role_id: number;
  name?: string;
  gender?: string;
  std_code?: string;
  contact?: string | number;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  age_group?: string;
  visited_year?: string[];
  subscribe?: 0 | 1;
}
