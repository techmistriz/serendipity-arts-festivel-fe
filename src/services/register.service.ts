import {
  SendOTPRequest,
  GeneralRegisterRequest,
  GuestRegisterRequest,
  SEARequest,
} from "@/types/auth";
import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";

export const sendOTP = (data: SendOTPRequest) => {
  return API<ApiResponse>("/auth/send-otp", METHODS.POST, data);
};

export const registerUser = (data: GeneralRegisterRequest) => {
  return API<ApiResponse>("/auth/register", METHODS.POST, data);
};

export const registerVIP = (data: GuestRegisterRequest) => {
  return API<ApiResponse>("/auth/vip-register", METHODS.POST, data);
};

export const registerSEA = (data: SEARequest) => {
  // Assuming SEA uses the same endpoint as general but with different fields
  return API<ApiResponse>("/auth/sea-delegate-register", METHODS.POST, data);
};

export interface ArchiveUserPayload {
  email: string;
  role_id: number;
}

export const archiveUser = (data: ArchiveUserPayload) => {
  return API<ApiResponse<ArchivedUser>>("/auth/archive-user", METHODS.POST, data);
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
