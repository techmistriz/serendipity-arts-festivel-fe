"use client";

import { useEffect, useState } from "react";

import { getVibes } from "@/services/vibe.service";
import type { Vibe } from "@/types/vibe";

export function useVibes() {
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchVibes = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVibes();

        if (!mounted) return;

        setVibes(data);
      } catch (err) {
        console.error("Failed to fetch vibes:", err);

        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch vibes");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchVibes();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    vibes,
    loading,
    error,
  };
}
