"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { getErrorMessage } from "@/utils/error";
import { sendContactMessage } from "@/services/contact.service";

import { CONTACT_SUBJECTS, PARTICIPATION_NOTE, PARTICIPATION_SUBJECT } from "../constants";
import type { ContactFormData } from "../types";

export function ContactForm({ onSuccess }: { onSuccess: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { control, register, handleSubmit, reset } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: CONTACT_SUBJECTS[0],
      message: "",
    },
  });
  const subject = useWatch({ control, name: "subject" });
  const showParticipationNote = subject === PARTICIPATION_SUBJECT;

  const submit = async (data: ContactFormData) => {
    if (showParticipationNote) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await sendContactMessage(data);
      reset();
      onSuccess();
    } catch (submissionError: unknown) {
      setError(getErrorMessage(submissionError, "Unable to send your message. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-8 md:col-span-8" onSubmit={handleSubmit(submit)}>
      <div>
        <label htmlFor="contact-name" className="label text-muted-foreground">
          Full Name
        </label>
        <input
          id="contact-name"
          required
          autoComplete="name"
          {...register("name")}
          className="input mt-2"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="label text-muted-foreground">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          autoComplete="email"
          {...register("email")}
          className="input mt-2"
        />
      </div>

      <div>
        <label htmlFor="contact-subject" className="label text-muted-foreground">
          Subject
        </label>
        <select id="contact-subject" className="input mt-2" {...register("subject")}>
          {CONTACT_SUBJECTS.map((contactSubject) => (
            <option key={contactSubject} value={contactSubject}>
              {contactSubject}
            </option>
          ))}
        </select>
      </div>

      {showParticipationNote ? (
        <div className="border border-accent bg-muted/30 p-5 md:p-6">
          <p className="label text-accent">A quick note</p>
          <p className="headline mt-3 max-w-prose text-base leading-relaxed text-muted-foreground md:text-lg">
            {PARTICIPATION_NOTE}
          </p>
          <a
            href="https://instagram.com/serendipityartsfoundation"
            target="_blank"
            rel="noopener noreferrer"
            className="label mt-6 inline-block border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            Follow @serendipityartsfoundation →
          </a>
        </div>
      ) : (
        <>
          <div>
            <label htmlFor="contact-message" className="label text-muted-foreground">
              Your query
            </label>
            <textarea
              id="contact-message"
              required
              rows={6}
              {...register("message")}
              className="input mt-2"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="headline rounded-full bg-foreground px-8 py-4 text-lg font-semibold text-background uppercase transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 md:text-xl"
          >
            {isSubmitting ? "Sending..." : "Send message →"}
          </button>
        </>
      )}
    </form>
  );
}
