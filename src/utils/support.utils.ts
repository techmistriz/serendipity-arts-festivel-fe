import { z } from "zod";
import type { DonationValues, DonationReceipt } from "@/types/support.types";

export const AMOUNTS = [1000, 2000, 5000, 10000];

export const donationSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    phone: z.string().trim().min(6, "Phone is required").max(20),
    email: z.string().trim().email("Enter a valid email").max(255),
    pin: z.string().trim().min(3, "Pin/Zip is required").max(12),
    pan: z.string().trim().max(20),
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
    if (!Number.isFinite(amount) || amount < 100)
      issue("other", "Enter an amount of at least 100.");
    if (data.residency === "India") {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.pan))
        issue("pan", "Enter a valid 10-character PAN.");
      if (!data.file?.length) issue("file", "Please select your PAN card.");
      if (!/^\d{12}$/.test(data.aadhaar.replace(/\s/g, "")))
        issue("aadhaar", "Enter a valid 12-digit Aadhaar number.");
      if (!data.aadhaarFile?.length) issue("aadhaarFile", "Please select your Aadhaar card.");
      if (amount <= 2500 && !data.receiptChoice)
        issue("receiptChoice", "Please tell us whether you need a receipt.");
    }
  });

export const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string(),
  org: z.string(),
  msg: z.string(),
});

export function printCertificate(receipt: DonationReceipt) {
  const popup = window.open("", "_blank", "width=800,height=900");
  if (!popup) return false;

  // Use textContent for submitted values so they cannot become HTML.
  popup.document.title = "Sample donation receipt";
  const style = popup.document.createElement("style");
  style.textContent =
    "body{font-family:Arial,sans-serif;color:#111;padding:48px;line-height:1.6}h1{font-size:28px}p{white-space:pre-wrap}@page{size:A4;margin:20mm}";
  popup.document.head.appendChild(style);
  const heading = popup.document.createElement("h1");
  heading.textContent = "Sample donation receipt — UI preview";
  popup.document.body.appendChild(heading);

  const details = [
    "No payment has been processed. This is not a valid donation or tax receipt.",
    `Preview reference: ${receipt.id}`,
    `Donor: ${receipt.name}`,
    `Email: ${receipt.email}`,
    `Amount: ${receipt.currency} ${receipt.amount.toLocaleString("en-IN")}`,
    `Tax residency: ${receipt.residency}`,
    `Date: ${receipt.date}`,
  ];
  for (const detail of details) {
    const paragraph = popup.document.createElement("p");
    paragraph.textContent = detail;
    popup.document.body.appendChild(paragraph);
  }
  popup.document.close();
  popup.focus();
  popup.print();
  return true;
}
