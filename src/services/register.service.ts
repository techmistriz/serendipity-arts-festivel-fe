import {
  SendOTPRequest,
  GeneralRegisterRequest,
  GuestRegisterRequest,
  SEARequest,
  ApiResponse,
} from "@/src/types/auth";
import api from "../lib/axios";

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
  return api.post<ApiResponse>("/auth/sea-register", data);
};