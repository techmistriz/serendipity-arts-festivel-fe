"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/redux/hooks";
import { clearSession } from "@/redux/slices/authSlice";

export default function SessionExpiryRedirect() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpiry = () => {
      dispatch(clearSession());
      router.replace("/login");
    };

    window.addEventListener("saf:session-expired", handleSessionExpiry);

    return () => window.removeEventListener("saf:session-expired", handleSessionExpiry);
  }, [dispatch, router]);

  return null;
}
