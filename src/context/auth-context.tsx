"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";

import { clearStoredSession, getStoredSession, storeSession } from "@/lib/auth-session";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSession, setAuthLoading, setSession } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import type { AuthSession, AuthUser, LoginCredentials } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  restoreSession: () => void;
  signIn: (credentials: LoginCredentials) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, token, user } = useAppSelector((state) => state.auth);

  const clearAuthSession = useCallback(() => {
    clearStoredSession();
    dispatch(clearSession());
  }, [dispatch]);

  const restoreSession = useCallback(() => {
    const session = getStoredSession();

    if (session) {
      dispatch(setSession(session));
      return;
    }

    clearAuthSession();
  }, [clearAuthSession, dispatch]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(
    async (credentials: LoginCredentials) => {
      dispatch(setAuthLoading(true));

      try {
        const session = await authService.login(credentials);

        try {
          storeSession(session);
        } catch (error) {
          clearAuthSession();
          throw error;
        }

        dispatch(setSession(session));

        return session;
      } finally {
        dispatch(setAuthLoading(false));
      }
    },
    [clearAuthSession, dispatch],
  );

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearAuthSession();
    }
  }, [clearAuthSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading: loading,
      restoreSession,
      signIn,
      signOut,
      clearSession: clearAuthSession,
    }),
    [clearAuthSession, isAuthenticated, loading, restoreSession, signIn, signOut, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return value;
}
