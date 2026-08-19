"use client";

import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { loginSuccess } from "./slices/auth/authSlice";

export default function AuthHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        dispatch(
          loginSuccess({
            token,
            user: JSON.parse(user),
          }),
        );
      } catch (error) {
        console.error("Failed to restore auth:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return null;
}
