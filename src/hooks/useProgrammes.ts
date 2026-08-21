"use client";

import { useEffect, useState } from "react";

import type { Programme } from "@/types/programme";
import { getProgrammes } from "@/services/programme.service";

export function useProgrammes(page = 1, limit?: number) {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProgrammes(page, limit);

        setProgrammes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch programmes");
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, [page, limit]);

  return {
    programmes,
    loading,
    error,
  };
}
