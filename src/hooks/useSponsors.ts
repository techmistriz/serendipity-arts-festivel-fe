"use client";

import { useEffect, useState } from "react";

import type { GroupedSponsors, Sponsors } from "@/types/sponsor";
import { getSponsors } from "@/services/sponsors";

type UseSponsorsOptions = {
  limit?: number;
  groupBySponsorType?: boolean;
};

export function useSponsors({ limit, groupBySponsorType = false }: UseSponsorsOptions = {}) {
  const [sponsors, setSponsors] = useState<Sponsors[]>([]);
  const [groupedSponsors, setGroupedSponsors] = useState<GroupedSponsors>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSponsors(limit, groupBySponsorType);

        if (groupBySponsorType) {
          setGroupedSponsors(data as GroupedSponsors);
          setSponsors([]);
        } else {
          setSponsors(data as Sponsors[]);
          setGroupedSponsors({});
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch sponsors");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, [limit, groupBySponsorType]);

  return {
    sponsors,
    groupedSponsors,
    loading,
    error,
  };
}
