import { RazorpayCheckoutOptions } from "@/services/cart.service";

export type DonationValues = {
  name: string;
  phone: string;
  email: string;
  pin: string;
  address: string;
  pan: string;
  amount: number;
  other: string;
  residency: string;
  file?: FileList;
  aadhaar: string;
  aadhaarFile?: FileList;
  receiptChoice: "yes" | "no" | "";
};

export type DonationReceipt = {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: "INR" | "USD";
  residency: string;
  receiptUrl: string | null;
};

export type EnquiryValues = {
  name: string;
  email: string;
  phone: string;
  org: string;
  msg: string;
};

export type SupportEnquiryType = "Sponsorship" | "Programme" | "CSR";

export type SupportEnquiryFormProps = {
  enquiryType: SupportEnquiryType;
  forEnquiry: string;
};

export type SupportEnquiryPayload = {
  enquiry_type: SupportEnquiryType;
  for_enquiry: string;
  name: string;
  email: string;
  phone: string;
  organisation: string;
  message: string;
};

export type CreateDonationResponse = {
  status: boolean;
  message: string;
  data: {
    payment_gateway: {
      name: string;
      checkout: RazorpayCheckoutOptions;
    };
    donation: {
      id: number;
      order_number: string;
      amount: string;
      tax_residency: string;
      is_need_donation_receipt: boolean;
    };
  };
};
