import type { CreateDonationResponse } from "@/types/support.types";
import type { RazorpayPaymentResponse } from "@/services/razorpay.service";
import API, { METHODS } from "@/network/API";

export type VerifyDonationResponse = {
  status: boolean;
  message: string;
  data?: {
    donation: {
      id: number;
      order_number: string;
      name: string;
      amount: string;
      tax_residency: string;
      is_need_donation_receipt: number;
    };
    receipt_url: string | null;
  };
};

export function createDonation(formData: FormData) {
  return API<CreateDonationResponse>("/donations", METHODS.POST, formData);
}

export function verifyDonationPayment(donationId: number, payment: RazorpayPaymentResponse) {
  return API<VerifyDonationResponse>("/donations/verify-payment", METHODS.POST, {
    donation_id: donationId,
    razorpay_payment_id: payment.razorpay_payment_id,
    razorpay_order_id: payment.razorpay_order_id,
    razorpay_signature: payment.razorpay_signature,
  });
}
