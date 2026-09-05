"use client";

import { type FormEvent, useState } from "react";

import { subscribeToNewsletter } from "@/services/newsletter.service";
import { getErrorMessage } from "@/utils/error";

type SubmissionStatus =
  { tone: "error"; message: string } | { tone: "success"; message: string } | null;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus(null);

      const subscription = await subscribeToNewsletter(email.trim());

      setStatus({ tone: "success", message: subscription.message });
      setEmail("");
    } catch (error: unknown) {
      setStatus({
        tone: "error",
        message: getErrorMessage(error, "Unable to subscribe. Please try again."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <form
        className="flex items-center gap-3 border-b border-foreground pb-2"
        onSubmit={handleSubmit}
      >
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="your@email"
          aria-label="Email address"
          autoComplete="email"
          inputMode="email"
          maxLength={255}
          required
          disabled={isSubmitting}
          className="flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="label transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe →"}
        </button>
      </form>

      {status && (
        <p
          role={status.tone === "error" ? "alert" : undefined}
          aria-live="polite"
          className={`mt-3 text-sm ${
            status.tone === "error" ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
