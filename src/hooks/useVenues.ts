"use client";

import { useEffect, useState } from "react";

import { getVenues } from "@/services/venue.service";
import type { Venue } from "@/types/venue";

interface UseVenuesOptions {
  limit?: number;
  featuredOnly?: boolean;
}

export function useVenues({ limit, featuredOnly = false }: UseVenuesOptions = {}) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchVenues = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getVenues(limit);

        if (!mounted) return;

        let filteredVenues = data;

        if (featuredOnly) {
          filteredVenues = data.filter((venue) => Boolean(venue.featured_image));
        }

        setVenues(filteredVenues);
      } catch (err) {
        console.error("Failed to fetch venues:", err);

        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch venues");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchVenues();

    return () => {
      mounted = false;
    };
  }, [limit, featuredOnly]);

  return {
    venues,
    loading,
    error,
  };
}
