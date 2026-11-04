"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "./SupportForms";
import type { DonationValues, DonationReceipt } from "@/types/support.types";
import { AMOUNTS, donationSchema, getDonationError } from "@/utils/support.utils";
import {
  createDonation,
  verifyDonationPayment,
  downloadDonationReceipt,
} from "@/services/donation.service";
import { openRazorpayCheckout } from "@/services/razorpay.service";
import axios from "axios";
import type { RazorpayPaymentResponse } from "@/services/razorpay.service";

export default function DonateForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      pin: "",
      pan: "",
      amount: 2000,
      other: "",
      residency: "India",
      aadhaar: "",
      receiptChoice: "",
    },
  });
  const [err, setErr] = useState("");
  const [done, setDone] = useState<DonationReceipt | null>(null);
  const [amount = 2000, other = "", residency = "India", files, aadhaarFiles] = useWatch({
    control,
    name: ["amount", "other", "residency", "file", "aadhaarFile"] as const,
  });
  const [downloading, setDownloading] = useState(false);

  const file = files?.[0];
  const aadhaarFile = aadhaarFiles?.[0];
  const finalAmount = other ? Number(other) : amount;
  const currency = residency === "India" ? "INR" : "USD";
  const sym = currency === "INR" ? "₹" : "$";
  const askReceiptChoice = residency === "India" && finalAmount <= 2500;
  const validationError = Object.values(errors).find((error) => error?.message)?.message;

  async function submit(data: DonationValues) {
    setErr("");
    const submittedAmount = data.other ? Number(data.other) : data.amount;
    const isIndia = data.residency === "India";
    const receiptRequested = isIndia
      ? submittedAmount > 2500 || data.receiptChoice === "yes"
      : true;

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("amount", String(submittedAmount));
    fd.append("payment_gateway", "RAZORPAY");
    fd.append("pincode", data.pin);
    fd.append("address", data.address);
    fd.append("tax_residency", data.residency);
    fd.append("nature_of_donation", "Voluntary");
    fd.append("is_need_donation_receipt", receiptRequested ? "1" : "0");

    if (isIndia) {
      fd.append("pan_number", data.pan);
      fd.append("aadhaar_number", data.aadhaar.replace(/\s/g, ""));
      if (file) fd.append("pan_card_image", file);
      if (aadhaarFile) fd.append("aadhaar_card_image", aadhaarFile);
    } else {
      fd.append("tax_id", data.pan);
      if (file) fd.append("tax_card_image", file);
    }

    try {
      const created = await createDonation(fd);

      const { donation, payment_gateway } = created.data;

      let payment: RazorpayPaymentResponse;
      try {
        payment = await openRazorpayCheckout(payment_gateway.checkout);
      } catch (e) {
        console.error("[donation] razorpay failed/cancelled:", e);
        setErr(getDonationError(e));
        return;
      }

      let receiptUrl: string | null = null;

      try {
        const verified = await verifyDonationPayment(donation.id, payment);

        if (!verified.status) {
          throw new Error(verified.message);
        }

        receiptUrl = verified.data?.receipt_url ?? null;
      } catch (e) {
        console.error("[donation] verify failed:", e);

        if (axios.isAxiosError(e)) {
          console.error("[donation] verify status/body:", e.response?.status, e.response?.data);
        }

        setErr(
          `We couldn't confirm your payment. If money was deducted, do not pay again. Please contact us with reference ${donation.order_number}.`,
        );

        return;
      }

      setDone({
        id: donation.order_number,
        donationId: donation.id,
        name: data.name,
        email: data.email,
        amount: Number(donation.amount),
        currency: payment_gateway.checkout.currency === "INR" ? "INR" : "USD",
        residency: donation.tax_residency,
        receiptUrl: receiptUrl,
        receiptRequested,
      });

      reset();
    } catch (e) {
      console.error("[donation] create failed:", e);
      if (axios.isAxiosError(e)) {
        console.error("[donation] create status/body:", e.response?.status, e.response?.data);
      }
      setErr(getDonationError(e));
    }
  }

  async function handleDownloadReceipt() {
    if (!done?.donationId) return;

    try {
      setDownloading(true);
      setErr("");

      const blob = await downloadDonationReceipt(done.donationId);

      // Check API response
      if (!(blob instanceof Blob) || blob.size === 0) {
        throw new Error("Receipt file is empty.");
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `donation-receipt-${done.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[donation] receipt download failed:", error);

      setErr("Unable to download your receipt. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-foreground p-6 md:p-8">
        <p className="display uppercase text-3xl">Thank you, {done.name.split(" ")[0]}.</p>

        <p className="mt-3 text-sm">
          Your donation of {done.currency === "INR" ? "₹" : "$"}
          {done.amount.toLocaleString("en-IN")} was received. Reference: {done.id}. A confirmation
          will be sent to {done.email}.
        </p>

        {done.receiptRequested && (
          <button
            type="button"
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="mt-6 inline-block label notch bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent disabled:opacity-50"
          >
            {downloading ? "Downloading..." : "Download donation receipt ↓"}
          </button>
        )}

        {err && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {err}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setDone(null);
            setErr("");
          }}
          className="mt-6 block text-sm underline"
        >
          Back to donation form
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(submit)}
      className="border border-foreground p-5 md:p-8 space-y-4"
    >
      <p className="text-center headline font-semibold">Select an amount</p>
      <div className="grid grid-cols-4 gap-2">
        {AMOUNTS.map((a) => (
          <button
            type="button"
            key={a}
            onClick={() => {
              setValue("amount", a, { shouldValidate: true });
              setValue("other", "", { shouldValidate: true });
            }}
            className={`border border-foreground py-3 text-sm font-bold ${!other && amount === a ? "bg-accent text-accent-foreground" : ""}`}
          >
            {sym}
            {a.toLocaleString("en-IN")}
          </button>
        ))}
      </div>
      <Field label={`${sym} Other amount`} type="number" min={100} {...register("other")} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name*" {...register("name")} />
        <Field label="Phone*" type="tel" {...register("phone")} />
        <Field label="Email*" type="email" {...register("email")} />
        <Field label="Pin/Zip Code*" {...register("pin")} />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-semibold mb-2">Address*</label>

        <textarea
          {...register("address")}
          rows={3}
          placeholder="Enter your full address"
          className="w-full border border-foreground bg-background px-4 py-3 text-sm resize-none"
        />

        {errors.address?.message && (
          <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>
      <select
        aria-label="Tax residency"
        {...register("residency")}
        className="w-full border border-foreground bg-background px-4 py-3 text-sm"
      >
        {["India", "United Kingdom", "United States", "European Union", "Other"].map((c) => (
          <option key={c} value={c}>
            Tax residency: {c}
          </option>
        ))}
      </select>
      <Field
        label={residency === "India" ? "PAN Number*" : "Tax ID"}
        required={residency === "India"}
        {...register("pan", {
          setValueAs: (value: string) => value.toUpperCase(),
          onChange: (e) => {
            e.target.value = e.target.value.toUpperCase();
          },
        })}
      />
      <label className="block border border-dashed border-foreground px-4 py-3 text-sm cursor-pointer">
        {file
          ? file.name
          : residency === "India"
            ? "Upload PAN card* (PDF or image)"
            : "Upload tax ID (PDF or image)"}
        <input
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          {...register("file")}
        />
      </label>
      {residency === "India" && (
        <>
          <Field
            label="Aadhaar Number*"
            required
            inputMode="numeric"
            maxLength={14}
            {...register("aadhaar", {
              setValueAs: (value: string) => value.replace(/[^\d ]/g, ""),
              onChange: (e) => {
                e.target.value = e.target.value.replace(/[^\d ]/g, "");
              },
            })}
          />
          <label className="block border border-dashed border-foreground px-4 py-3 text-sm cursor-pointer">
            {aadhaarFile ? aadhaarFile.name : "Upload Aadhaar card* (PDF or image)"}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              {...register("aadhaarFile")}
            />
          </label>
        </>
      )}
      {askReceiptChoice && (
        <fieldset className="border border-foreground p-4">
          <legend className="px-2 text-sm font-semibold">Do you need a donation receipt?</legend>
          <div className="mt-1 flex gap-6 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" value="yes" {...register("receiptChoice")} /> Yes
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" value="no" {...register("receiptChoice")} /> No
            </label>
          </div>
        </fieldset>
      )}
      {(validationError || err) && (
        <p role="alert" className="text-sm text-destructive">
          {validationError ?? err}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full label notch bg-foreground text-background py-4 hover:bg-accent disabled:opacity-50"
      >
        {isSubmitting
          ? "Processing…"
          : `Donate ${sym}${(Number.isFinite(finalAmount) ? finalAmount : 0).toLocaleString("en-IN")} →`}
      </button>
      <div className="border-t border-foreground pt-4 text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">Receipt and tax terms</p>
        <p>
          The final signed 80G receipt is issued with the Foundation&apos;s registration details
          once your payment is confirmed.
        </p>
        <p>
          For an Indian ITR, retain the final receipt and payment proof, then use the Foundation
          details printed on that receipt. Deduction eligibility depends on Section 80G, payment
          method and your applicable tax regime. Please consult a tax professional for personal
          advice.
        </p>
      </div>
    </form>
  );
}
