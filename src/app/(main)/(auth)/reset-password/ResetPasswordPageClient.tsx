"use client";

import { Suspense, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { authService } from "@/services/auth.service";
import { getErrorMessage } from "@/utils/error";

type ResetPasswordForm = {
  password: string;
  password_confirmation: string;
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (data: ResetPasswordForm) => {
    setApiError("");

    if (!token || !email) {
      setApiError(
        "This password reset link is invalid or incomplete. Please request a new reset link.",
      );
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      setSuccess(true);
    } catch (error: unknown) {
      setApiError(
        getErrorMessage(error, "Unable to reset your password. The link may have expired."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-editorial pt-12 md:pt-24 pb-32 mx-auto">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h1 className="display uppercase text-[10vw] sm:text-[8vw] md:text-[6vw] leading-[0.9] whitespace-nowrap">
          Reset Password
        </h1>

        <p className="mt-4 text-muted-foreground headline">
          Create a new password for your account.
        </p>

        {!success ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-10 w-full max-w-md mx-auto text-left space-y-6"
          >
            {/* Email */}
            <div>
              <label className="label text-muted-foreground block text-start">Email ID</label>

              <input
                type="email"
                value={email}
                readOnly
                className="input mt-2 w-full opacity-70 cursor-not-allowed"
              />

              {!email && (
                <p className="mt-2 text-sm text-red-500 text-center">
                  Email is missing from the reset link.
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="label text-muted-foreground block text-start">New Password</label>

              <input
                type="password"
                className="input mt-2 w-full"
                placeholder="Enter your new password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              {errors.password && (
                <p className="mt-2 text-sm text-red-500 text-center">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label text-muted-foreground block text-start">
                Confirm Password
              </label>

              <input
                type="password"
                className="input mt-2 w-full"
                placeholder="Confirm your new password"
                {...register("password_confirmation", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />

              {errors.password_confirmation && (
                <p className="mt-2 text-sm text-red-500 text-center">
                  {errors.password_confirmation.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="border border-red-500 p-4 text-center">
                <p className="text-sm text-red-500">{apiError}</p>
              </div>
            )}

            {/* Button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={loading || !token || !email}
                className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password →"}
              </button>
            </div>

            {/* Login */}
            <p className="label pt-4 text-center">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-foreground underline underline-offset-4 hover:text-accent"
              >
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <div className="mt-10 max-w-md mx-auto">
            <div className="border border-foreground p-6 text-center">
              <p className="label text-accent">Password updated</p>

              <p className="mt-3 headline font-semibold uppercase text-2xl leading-[1]">
                Your password has been reset.
              </p>

              <p className="mt-3 text-sm text-muted-foreground headline">
                You can now sign in using your new password.
              </p>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-6 headline uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
              >
                Go to sign in →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResetPasswordPageClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
