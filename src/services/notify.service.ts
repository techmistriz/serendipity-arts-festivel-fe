import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { NotifyMeData, NotifyMePayload } from "@/utils/notify";

export async function sendNotifyMe(data: NotifyMePayload): Promise<ApiResponse<NotifyMeData>> {
  console.log("[sendNotifyMe] Initiating request:", data);

  try {
    const response = await API<ApiResponse<NotifyMeData>>("/notify-me", METHODS.POST, data);

    console.log("[sendNotifyMe] Raw API response:", response);

    return response;
  } catch (error) {
    console.error("[sendNotifyMe] Failed:", error);
    throw error;
  }
}
