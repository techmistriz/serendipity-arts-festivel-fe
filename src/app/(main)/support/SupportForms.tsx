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
    mode: "onTouched",
    reValidateMode: "onChange",
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
      let hasFieldErrors = false;

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

          if (fieldMessage) {
            hasFieldErrors = true;
            setError(field, {
              type: "server",
              message: fieldMessage,
            });
          }
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      if (!hasFieldErrors) {
        setError("root", {
          type: "server",
          message,
        });
      }
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
      <div>
        <Field
          label="Name*"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "enquiry-name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="enquiry-name-error" className="mt-1 text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Field
          label="Organisation"
          autoComplete="organization"
          aria-invalid={!!errors.org}
          {...register("org")}
        />
        {errors.org && <p className="mt-1 text-sm text-destructive">{errors.org.message}</p>}
      </div>

      <div>
        <Field
          label="Email*"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div>
        <Field
          label="Phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone}
          {...register("phone")}
        />
        {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="md:col-span-2">
        <textarea
          aria-label="Tell us what you have in mind"
          placeholder="Tell us what you have in mind"
          aria-invalid={!!errors.msg}
          {...register("msg")}
          className="w-full border border-foreground bg-background px-4 py-3 text-sm min-h-24"
        />
        {errors.msg && <p className="mt-1 text-sm text-destructive">{errors.msg.message}</p>}
      </div>

      {errors.root?.message && (
        <p role="alert" className="text-sm text-destructive md:col-span-2">
          {errors.root.message}
        </p>
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
