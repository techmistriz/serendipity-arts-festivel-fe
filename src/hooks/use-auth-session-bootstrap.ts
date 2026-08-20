"use client";

import { useEffect } from "react";

import API, { METHODS } from "@/network/API";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSession, setAuthLoading, setSession } from "@/redux/slices/authSlice";
import type { ApiResponse } from "@/types/api";
import type { AuthSession } from "@/types/auth";

export function useAuthSessionBootstrap() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const loadSession = async () => {
      if (!accessToken) {
        dispatch(clearSession());
        return;
      }

      dispatch(setAuthLoading(true));

      try {
        const response = await API<ApiResponse<Pick<AuthSession, "user">>>(
          "/auth/user",
          METHODS.GET,
        );

        if (!response.status || !response.data?.user) {
          throw new Error(response.message || "Unable to restore your session.");
        }

        dispatch(setSession({ ...response.data, token: accessToken }));
      } catch {
        dispatch(clearSession());
      }
    };

    void loadSession();
  }, [accessToken, dispatch]);
}
