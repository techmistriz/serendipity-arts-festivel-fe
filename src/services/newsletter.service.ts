import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import { getApiResponseData } from "@/utils/api";

type NewsletterSubscription = {
  email: string;
  already_subscribed: boolean;
};

export async function subscribeToNewsletter(email: string) {
  const response = await API<ApiResponse<NewsletterSubscription>>(
    "/newsletter/subscribe",
    METHODS.POST,
    { email },
  );
  const subscription = getApiResponseData(response, "Unable to subscribe to the newsletter.");

  return {
    ...subscription,
    message: response.message,
  };
}
