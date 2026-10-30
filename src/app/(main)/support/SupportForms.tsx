"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { isAxiosError } from "axios";
import { sendSupportEnquiry } from "@/services/support.service";
import type { EnquiryValues, SupportEnquiryFormProps } from "@/types/support.types";
import { enquirySchema } from "@/utils/support.utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const Field = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>(function Field({ label, ...p }, ref) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        {...p}
        ref={ref}
        placeholder={label}
        className="w-full border border-foreground bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
});

export function EnquiryForm({ enquiryType, forEnquiry }: SupportEnquiryFormProps) {
  const [state, setState] = useState<"idle" | "done">("idle");
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", email: "", phone: "", org: "", msg: "" },
  });
  async function submit(data: EnquiryValues) {
    clearErrors("root");
    try {
      await sendSupportEnquiry({
        enquiry_type: enquiryType,
        for_enquiry: forEnquiry,
        name: data.name,
        email: data.email,
        phone: data.phone.trim(),
        organisation: data.org.trim(),
        message: data.msg.trim(),
      });
      setState("done");
    } catch (error: unknown) {
      let message = "Unable to send your enquiry. Please try again.";
      if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
        message = error.response?.data?.message || message;
        const fieldMap = {
          name: "name",
          email: "email",
          phone: "phone",
          organisation: "org",
          message: "msg",
        } as const;
        const serverErrors = error.response?.data?.errors;
        for (const [key, field] of Object.entries(fieldMap)) {
          const fieldMessage = serverErrors?.[key]?.[0];
          if (fieldMessage) setError(field, { type: "server", message: fieldMessage });
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setError("root", { type: "server", message });
    }
  }
  if (state === "done")
    return (
      <p className="headline font-semibold">
        Thank you. Our partnerships team will write to you within a week.
      </p>
    );
  return (
    <form
      aria-busy={isSubmitting}
      noValidate
      onSubmit={handleSubmit(submit)}
      className="grid md:grid-cols-2 gap-3"
    >
      <Field label="Name*" {...register("name")} />
      <Field label="Organisation" {...register("org")} />
      <Field label="Email*" type="email" {...register("email")} />
      <Field label="Phone" {...register("phone")} />
      <textarea
        aria-label="Tell us what you have in mind"
        placeholder="Tell us what you have in mind"
        {...register("msg")}
        className="md:col-span-2 border border-foreground bg-background px-4 py-3 text-sm min-h-24"
      />
      {Object.entries(errors).map(([key, error]) =>
        error?.message ? (
          <p key={key} role="alert" className="text-sm text-destructive md:col-span-2">
            {error.message}
          </p>
        ) : null,
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="md:col-span-2 label notch bg-foreground text-background py-4 hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending…" : "Send enquiry →"}
      </button>
    </form>
  );
}
