import axios from "axios";

type ErrorPayload = {
  message?: unknown;
  errors?: unknown;
};

const getFirstValidationError = (errors: unknown): string | undefined => {
  if (!errors || typeof errors !== "object") return undefined;

  const firstError = Object.values(errors as Record<string, unknown>)[0];

  if (Array.isArray(firstError)) {
    return typeof firstError[0] === "string" ? firstError[0] : undefined;
  }

  return typeof firstError === "string" ? firstError : undefined;
};

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorPayload | undefined;

    return (
      (typeof data?.message === "string" && data.message) ||
      getFirstValidationError(data?.errors) ||
      fallback
    );
  }

  return error instanceof Error ? error.message : fallback;
}

export function getAuthenticationErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "We could not reach the server. Check your connection and try again.";
    }

    if (error.response.status === 429) {
      return "Too many sign-in attempts. Please wait a moment and try again.";
    }
  }

  return "Unable to sign in. Check your email and password, then try again.";
}
