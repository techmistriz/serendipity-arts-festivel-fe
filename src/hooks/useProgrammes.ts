"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Programme } from "@/types/programme";
import { getProgrammes } from "@/services/programme.service";

const DEFAULT_LIMIT = 12;

interface UseProgrammesResult {
  programmes: Programme[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  refetch: () => Promise<void>;
}

interface UseProgrammesOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useProgrammes({
  page = 1,
  limit = DEFAULT_LIMIT,
  enabled = true,
}: UseProgrammesOptions = {}): UseProgrammesResult {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(enabled); // Initialize based on enabled
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(limit);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchProgrammes = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getProgrammes(page, limit);

      if (!isMountedRef.current) return;

      if (!Array.isArray(data)) {
        console.warn("[useProgrammes] Invalid data received:", data);
        setProgrammes([]);
        setTotal(0);
        setError("Invalid data received from server");
        return;
      }

      setProgrammes(data);
      setTotal(data.length);
      setCurrentPage(page);
      setPerPage(limit);
      setLastPage(Math.max(1, Math.ceil(data.length / limit)));
    } catch (error) {
      if (!isMountedRef.current) return;

      const errorMessage = error instanceof Error ? error.message : "Failed to fetch programmes";
      console.error("[useProgrammes] Error:", errorMessage);

      setError(errorMessage);
      setProgrammes([]);
      setTotal(0);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [page, limit]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;

    const loadProgrammes = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProgrammes(page, limit);

        if (cancelled) return;

        if (!Array.isArray(data)) {
          console.warn("[useProgrammes] Invalid data received:", data);
          setProgrammes([]);
          setTotal(0);
          setError("Invalid data received from server");
          return;
        }

        setProgrammes(data);
        setTotal(data.length);
        setCurrentPage(page);
        setPerPage(limit);
        setLastPage(Math.max(1, Math.ceil(data.length / limit)));
      } catch (error) {
        if (cancelled) return;

        const errorMessage = error instanceof Error ? error.message : "Failed to fetch programmes";
        console.error("[useProgrammes] Error:", errorMessage);

        setError(errorMessage);
        setProgrammes([]);
        setTotal(0);
      } finally {
        if (!cancelled && isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    void loadProgrammes();

    return () => {
      cancelled = true;
    };
  }, [page, limit, enabled]); // Add loading to dependencies

  return {
    programmes,
    loading,
    error,
    total,
    currentPage,
    lastPage,
    perPage,
    refetch: fetchProgrammes,
  };
}
