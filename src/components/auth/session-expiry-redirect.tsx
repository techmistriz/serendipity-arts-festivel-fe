"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

export default function SessionExpiryRedirect() {
  const { clearSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleSessionExpiry = () => {
      clearSession();
      router.replace("/login");
    };

    window.addEventListener("saf:session-expired", handleSessionExpiry);

    return () => window.removeEventListener("saf:session-expired", handleSessionExpiry);
  }, [clearSession, router]);

  return null;
}
