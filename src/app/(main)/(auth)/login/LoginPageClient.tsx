"use client";

import { Suspense } from "react";

import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthLoading, setSession } from "@/redux/slices/authSlice";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "@/services/auth.service";
import { getAuthenticationErrorMessage } from "@/utils/error";
import { siteConfig } from "@/config/site";

type LoginForm = {
  email: string;
  password: string;
};

type ForgotPasswordForm = {
  email: string;
};

const getSafeRedirectPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }

  return value;
};

const getGameUrl = (accessToken: string) => {
  const gameUrl = new URL(siteConfig.game_url);
  // Keep the bearer token out of server requests and logs.
  gameUrl.hash = new URLSearchParams({ token: accessToken }).toString();
  return gameUrl.toString();
};

function LoginContent() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = getSafeRedirectPath(searchParams.get("next"));
  const returnToGame = searchParams.get("game") === "serendipity-dash";

  const [forgot, setForgot] = useState(false);
  const [sent, setSent] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const { loading: isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoginError(null);
    dispatch(setAuthLoading(true));

    try {
      const session = await authService.login(data);
      dispatch(setSession(session));
      if (returnToGame) {
        window.location.assign(getGameUrl(session.token));
      } else {
        router.replace(next);
      }
    } catch (error: unknown) {
      setLoginError(getAuthenticationErrorMessage(error));
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const onForgotSubmit = async (data: ForgotPasswordForm) => {
    setForgotError(null);
    setIsForgotLoading(true);

    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      setForgotError("We could not send a reset link. Please try again.");
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="container-editorial pt-12 md:pt-24 pb-32 max-w-lg">
      <h1 className="display uppercase text-[14vw] md:text-[7vw] leading-[0.9]">Login</h1>
      <p className="mt-4 text-muted-foreground headline ">
        Sign in to book your programmes and see dashboard.
      </p>

      {!forgot ? (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
          {loginError && (
            <Alert variant="destructive">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <div>
            <Label htmlFor="login-email" className="text-muted-foreground">
              Email address
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <FieldError id="login-email-error" className="mt-1">
                {errors.email.message}
              </FieldError>
            )}
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <Label htmlFor="login-password" className="text-muted-foreground">
                Password
              </Label>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setForgot(true);
                }}
                className="label text-accent hover:underline underline-offset-4 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className="mt-2"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            {errors.password && (
              <FieldError id="login-password-error" className="mt-1">
                {errors.password.message}
              </FieldError>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            aria-busy={isLoading}
            className="h-auto rounded-full px-8 py-4 headline text-lg font-semibold uppercase md:text-xl"
          >
            {isLoading ? "Signing in..." : "Sign in →"}
          </Button>
          <p className="label pt-4">
            New here?{" "}
            <Link
              href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-foreground underline underline-offset-4 hover:text-accent"
            >
              Register instead
            </Link>
          </p>
        </form>
      ) : (
        <div className="mt-10 space-y-6">
          {!sent ? (
            <form noValidate onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-6">
              {forgotError && (
                <Alert variant="destructive">
                  <AlertDescription>{forgotError}</AlertDescription>
                </Alert>
              )}
              <p className="text-muted-foreground headline">
                Enter your email address and we’ll send a reset link.
              </p>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                aria-invalid={Boolean(forgotErrors.email)}
                aria-describedby={forgotErrors.email ? "forgot-email-error" : undefined}
                placeholder="Enter your email"
                {...registerForgot("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />

              {forgotErrors.email && (
                <FieldError id="forgot-email-error">{forgotErrors.email.message}</FieldError>
              )}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isForgotLoading}
                  aria-busy={isForgotLoading}
                  className="h-auto rounded-full px-6 py-3 headline uppercase tracking-[0.06em]"
                >
                  {isForgotLoading ? "Sending..." : "Send reset link →"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setForgotError(null);
                    setForgot(false);
                  }}
                  className="headline uppercase tracking-[0.06em] border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-foreground p-6">
              <p className="label text-accent">Check your inbox</p>
              <p className="mt-3 headline font-semibold uppercase text-2xl leading-[1]">
                We’ve sent a reset link.
              </p>
              <p className="mt-3 text-sm text-muted-foreground headline">
                Follow the link in the message to set a new password.
              </p>
              <button
                onClick={() => {
                  setForgot(false);
                  setSent(false);
                }}
                className="mt-6 label text-accent hover:underline underline-offset-4"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function LoginPageClient() {
  return (
    <Suspense fallback={<RouteLoadingOverlay label="Loading sign in" />}>
      <LoginContent />
    </Suspense>
  );
}
