"use client";

import { sendNotifyMe } from "@/services/notify.service";
import { X } from "lucide-react";
import { useState } from "react";

type NotifyMeModalProps = {
  programmeId: string | number;
  programmeName: string;
  isOpen: boolean;
  onClose: () => void;

  user?: {
    id?: string | number;
    name?: string;
    email?: string;
  } | null;
};

export function NotifyMeModal({
  programmeId,
  programmeName,
  isOpen,
  onClose,
  user,
}: NotifyMeModalProps) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendNotifyMe({
        name: name.trim(),
        email: email.trim(),
        user_id: user?.id || "",
        program_id: programmeId,
      });

      console.log("[Notify Me] API response:", response);

      setSuccessMessage(
        response?.message || "You have been successfully added to the notification list.",
      );

      setSuccess(true);
    } catch (err: unknown) {
      console.error("[Notify Me] Failed:", err);

      const apiError = err as {
        response?: {
          data?: {
            message?: string;
            errors?: {
              email?: string[];
              name?: string[];
              contact?: string[];
              program_id?: string[];
            };
          };
        };
        message?: string;
      };

      const errors = apiError.response?.data?.errors;

      const fieldError =
        errors?.email?.[0] || errors?.name?.[0] || errors?.contact?.[0] || errors?.program_id?.[0];

      setError(
        fieldError ||
          apiError.response?.data?.message ||
          apiError.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-background p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {!success && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center transition-colors hover:bg-foreground hover:text-background"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        )}

        {success ? (
          <div className="py-8 text-center">
            <h2 className="headline text-xl">You&apos;re on the list</h2>

            <p className="mt-3 text-sm">{successMessage}</p>

            <button
              type="button"
              onClick={onClose}
              className="headline mt-6 border border-foreground px-6 py-3 text-xs uppercase transition-colors hover:bg-foreground hover:text-background"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="headline text-xl uppercase">Notify Me</h2>

              <p className="mt-2 text-sm">
                Get notified when <strong>{programmeName}</strong> drops.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label mb-1 block text-xs">Name</label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-foreground bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="label mb-1 block text-xs">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-foreground bg-transparent px-3 py-2 text-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="headline flex w-full items-center justify-center gap-2 border border-foreground px-4 py-3 text-sm uppercase transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
