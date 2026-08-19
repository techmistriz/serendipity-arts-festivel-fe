import type { AuthSession, AuthUser } from "@/types/auth";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const isAuthUser = (value: unknown): value is AuthUser => {
  if (!value || typeof value !== "object") return false;

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "number" && typeof user.name === "string" && typeof user.email === "string"
  );
};

export const getStoredAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const token = window.localStorage.getItem(TOKEN_KEY)?.trim();

    return token || null;
  } catch {
    return null;
  }
};

export const getStoredSession = (): AuthSession | null => {
  const token = getStoredAuthToken();

  if (!token || typeof window === "undefined") return null;

  try {
    const user = JSON.parse(window.localStorage.getItem(USER_KEY) ?? "null") as unknown;

    return isAuthUser(user) ? { token, user } : null;
  } catch {
    return null;
  }
};

export const storeSession = ({ token, user }: AuthSession) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    clearStoredSession();
    throw new Error("Your browser could not save the sign-in session.");
  }
};

export const clearStoredSession = () => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // Browser privacy settings can block storage access. There is no session to retain in that case.
  }
};
