"use client";

import { useEffect, useState } from "react";
import type { Sponsors } from "@/src/types/sponsor";
import { getSponsors } from "../services/sponsors";

export function useSponsors(limit = 5) {
  const [sponsors, setSponsors] = useState<Sponsors[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSponsors(limit);

        setSponsors(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch sponsors"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [limit]);

  return {
    sponsors,
    loading,
    error,
  };
}