import { z } from "zod";
import type { DonationValues } from "@/types/support.types";

export const AMOUNTS = [1000, 2000, 5000, 10000];

export const donationSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    phone: z.string().trim().min(6, "Phone is required").max(20),
    email: z.string().trim().email("Enter a valid email").max(255),
    pin: z.string().trim().min(3, "Pin/Zip is required").max(12),
    pan: z.string().trim().max(20),
    address: z.string().min(1, "Address is required"),
    amount: z.number(),
    other: z.string(),
    residency: z.string(),
    file: z.custom<FileList>().optional(),
    aadhaar: z.string(),
    aadhaarFile: z.custom<FileList>().optional(),
    receiptChoice: z.enum(["yes", "no", ""]),
  })

  .superRefine((data, ctx) => {
    const amount = data.other ? Number(data.other) : data.amount;

    const issue = (path: keyof DonationValues, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (!Number.isFinite(amount) || amount < 100) {
      issue("other", "Enter an amount of at least 100.");
    }

    if (data.residency === "India") {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan)) {
        issue("pan", "Enter a valid 10-character PAN.");
      }

      if (!data.file?.length) {
        issue("file", "Please select your PAN card.");
      }

      if (!/^\d{12}$/.test(data.aadhaar.replace(/\s/g, ""))) {
        issue("aadhaar", "Enter a valid 12-digit Aadhaar number.");
      }

      if (!data.aadhaarFile?.length) {
        issue("aadhaarFile", "Please select your Aadhaar card.");
      }

      if (amount <= 2500 && !["yes", "no"].includes(data.receiptChoice)) {
        issue("receiptChoice", "Please select Yes or No.");
      }
    }
  });

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string(),
  org: z.string(),
  msg: z.string(),
});

import axios from "axios";

export function getDonationError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string; errors?: Record<string, string[]> } | undefined;
    const firstFieldError = data?.errors && Object.values(data.errors)[0]?.[0];
    return firstFieldError ?? data?.message ?? "Unable to create donation. Please try again.";
  }
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
