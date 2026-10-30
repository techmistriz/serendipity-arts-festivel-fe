"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "./SupportForms";
import type { DonationValues, DonationReceipt } from "@/types/support.types";
import { AMOUNTS, donationSchema, printCertificate } from "@/utils/support.utils";

export default function DonateForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<DonationValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
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
  const file = files?.[0];
  const aadhaarFile = aadhaarFiles?.[0];
  const finalAmount = other ? Number(other) : amount;
  const currency = residency === "India" ? "INR" : "USD";
  const sym = currency === "INR" ? "₹" : "$";
  const askReceiptChoice = residency === "India" && finalAmount <= 2500;
  const validationError = Object.values(errors).find((error) => error?.message)?.message;

  function submit(data: DonationValues) {
    setErr("");
    const submittedAmount = data.other ? Number(data.other) : data.amount;
    // UI preview only. Set success after backend payment verification when integrated.
    setDone({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      amount: submittedAmount,
      currency: data.residency === "India" ? "INR" : "USD",
      residency: data.residency,
      date: new Date().toLocaleDateString("en-IN"),
      receiptRequested:
        data.residency !== "India" || submittedAmount > 2500 || data.receiptChoice === "yes",
    });
  }

  if (done) {
    return (
      <div className="border border-foreground p-6 md:p-8">
        <p className="display uppercase text-3xl">Thank you, {done.name.split(" ")[0]}.</p>

        <p className="mt-3 text-sm">
          Your donation of {done.currency === "INR" ? "₹" : "$"}
          {done.amount.toLocaleString("en-IN")} — success screen preview. No payment has been
          processed.
        </p>

        {done.receiptRequested && (
          <button
            type="button"
            onClick={() => {
              if (!printCertificate(done)) {
                setErr("Please allow pop-ups to print the sample receipt.");
              }
            }}
            className="mt-6 label notch bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent"
          >
            Download sample receipt ↓
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
          className="mt-4 block text-sm underline"
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
        label={residency === "India" ? "PAN Number*" : "Tax ID (Optional)"}
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
            : "Upload tax ID (PDF or image, optional)"}
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
      {validationError && (
        <p role="alert" className="text-sm text-destructive">
          {validationError}
        </p>
      )}
      <button
        type="submit"
        className="w-full label notch bg-foreground text-background py-4 hover:bg-accent disabled:opacity-50"
      >
        {`Donate ${sym}${(Number.isFinite(finalAmount) ? finalAmount : 0).toLocaleString("en-IN")} →`}
      </button>
      <div className="border-t border-foreground pt-4 text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">Receipt and tax terms</p>
        <p>
          The downloadable receipt remains provisional until payment is confirmed and the final
          signed 80G receipt is issued with the Foundation&apos;s registration details.
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
