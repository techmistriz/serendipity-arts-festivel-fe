export type DonationValues = {
  name: string;
  phone: string;
  email: string;
  pin: string;
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
  date: string;
  receiptRequested: boolean;
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
