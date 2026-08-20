"use client";

import { useAppSelector } from "@/redux/hooks";

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);

  return {
    ...auth,
    isAuthenticated: Boolean(auth.accessToken),
  };
}
