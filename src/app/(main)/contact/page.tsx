"use client";

import { contactUsAPI } from "@/services/contact";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SUBJECTS = [
  "Not able to register",
  "Not able to book programmes",
  "Participation at the festival",
  "Press & media",
  "Partnerships",
  "Accessibility",
  "Other",
];

const PARTICIPATION_NOTE =
  "Thank you for your interest in participating! Our Festival programmes are selected by our curators, and this year’s programming has already been closed. However, we regularly release open calls and grants for select projects — please follow us on Instagram @serendipityartsfoundation to stay updated on future opportunities.";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, reset } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: SUBJECTS[0],
      message: "",
    },
  });

  const subject = watch("subject");

  const showParticipation = subject === "Participation at the festival";

  const handleFormSubmit = async (data: ContactFormData) => {
    if (showParticipation) return;

    try {
      setLoading(true);
      setError("");

      // Print data BEFORE API call
      console.log("Data being sent to Contact API:", data);

      const response = await contactUsAPI({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      console.log("Contact API response:", response);

      setSent(true);
      reset();
    } catch (error: unknown) {
      console.error("Contact API error:", error);

      const responseData = error instanceof AxiosError ? error.response?.data : null;
      setError(
        typeof responseData === "object" && responseData !== null && "message" in responseData
          ? String(responseData.message)
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[12vw] md:text-[8vw] leading-[0.9]">Thank you.</h1>

        <p className="mt-8 max-w-xl text-muted-foreground headline text-lg">
          We’ve received your message and will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Contact</h1>

      <p className="mt-6 max-w-2xl text-muted-foreground headline text-base md:text-lg">
        Shoot us your queries, and we’ll get back to you as soon as possible.
      </p>

      <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <aside className="md:col-span-4 space-y-6">
          <div className="rule-t pt-4">
            <p className="label text-muted-foreground">Email</p>
            <p className="mt-1 headline">info@serendipityarts.org</p>
          </div>
        </aside>

        <form className="md:col-span-8 space-y-8" onSubmit={handleSubmit(handleFormSubmit)}>
          <div>
            <p className="label text-muted-foreground">Full Name</p>

            <input required {...register("name")} className="input mt-2" />
          </div>

          <div>
            <p className="label text-muted-foreground">Email</p>

            <input type="email" required {...register("email")} className="input mt-2" />
          </div>

          <div>
            <p className="label text-muted-foreground">Subject</p>

            <select className="input mt-2" {...register("subject")}>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {showParticipation ? (
            <div className="border border-accent p-5 md:p-6 bg-muted/30">
              <p className="label text-accent">A quick note</p>

              <p className="mt-3 headline text-base md:text-lg leading-relaxed text-muted-foreground max-w-prose">
                {PARTICIPATION_NOTE}
              </p>

              <a
                href="https://instagram.com/serendipityartsfoundation"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
              >
                Follow @serendipityartsfoundation →
              </a>
            </div>
          ) : (
            <>
              <div>
                <p className="label text-muted-foreground">Your query</p>

                <textarea required rows={6} {...register("message")} className="input mt-2" />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send message →"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
