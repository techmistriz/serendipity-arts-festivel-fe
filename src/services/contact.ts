import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";

export const contactUsAPI = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return API<ApiResponse>("/contact-us", METHODS.POST, data);
};
