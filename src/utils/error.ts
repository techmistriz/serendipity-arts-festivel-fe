import axios from "axios";

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      { message?: string; errors?: Record<string, string[]> } | undefined;
    return data?.message ?? Object.values(data?.errors ?? {})[0]?.[0] ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
