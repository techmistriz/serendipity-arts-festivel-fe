"use client";

import { useEffect, useState } from "react";

import { getCurators } from "@/services/curator.service";
import type { Curator } from "@/types/curator";

export function useCurators(limit?: number) {
  const [curators, setCurators] = useState<Curator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCurators = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCurators(limit);

        if (mounted) {
          setCurators(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch curators");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCurators();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return {
    curators,
    loading,
    error,
  };
}
