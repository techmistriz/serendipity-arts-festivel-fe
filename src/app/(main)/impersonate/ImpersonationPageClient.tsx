"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";
import { useAppDispatch } from "@/redux/hooks";
import { setAuthLoading, setSession } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";

export function ImpersonationPageClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const grant = new URLSearchParams(window.location.hash.slice(1)).get("grant");

    // Remove the one-time grant before the API call so it cannot be copied or
    // accidentally retained in browser history.
    window.history.replaceState(null, "", window.location.pathname);

    if (!grant) {
      const errorTimer = window.setTimeout(() => {
        setError("This impersonation link is invalid or has expired.");
      }, 0);

      return () => window.clearTimeout(errorTimer);
    }

    let cancelled = false;

    const exchangeGrant = async () => {
      dispatch(setAuthLoading(true));

      try {
        const session = await authService.exchangeImpersonationGrant(grant);

        if (cancelled) return;

        dispatch(setSession(session));
        router.replace("/dashboard");
      } catch {
        if (!cancelled) {
          setError("This impersonation link is invalid or has expired.");
        }
      } finally {
        if (!cancelled) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    void exchangeGrant();

    return () => {
      cancelled = true;
    };
  }, [dispatch, router]);

  if (error) {
    return (
      <main className="container-editorial py-24">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </main>
    );
  }

  return <RouteLoadingOverlay />;
}
