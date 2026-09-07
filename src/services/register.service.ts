import {
  SendOTPRequest,
  GeneralRegisterRequest,
  GuestRegisterRequest,
  SEARequest,
  AuthSession,
  ArchivedUser,
  ArchiveUserPayload,
} from "@/types/auth";

import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";

export const sendOTP = (data: SendOTPRequest) => {
  return API<ApiResponse>("/auth/send-otp", METHODS.POST, data);
};

export const registerUser = (data: GeneralRegisterRequest) => {
  return API<ApiResponse<AuthSession>>("/auth/register", METHODS.POST, data);
};

export const registerVIP = (data: GuestRegisterRequest) => {
  return API<ApiResponse<AuthSession>>("/auth/vip-register", METHODS.POST, data);
};

export const registerSEA = (data: SEARequest) => {
  return API<ApiResponse<AuthSession>>("/auth/sea-delegate-register", METHODS.POST, data);
};

export const archiveUser = (data: ArchiveUserPayload) => {
  return API<ApiResponse<ArchivedUser>>("/auth/archive-user", METHODS.POST, data);
};
