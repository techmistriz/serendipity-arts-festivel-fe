import { useState, useEffect, useCallback } from "react";
import { ProgramDetailResponse, Programme } from "@/types/programme";
import { getProgrammeBySlug, getProgrammeDetail } from "@/services/programme.service";

interface UseProgrammeDetailResult {
  programme: Programme | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fullResponse: ProgramDetailResponse | null;
}

interface UseProgrammeDetailOptions {
  includeFullResponse?: boolean;
  autoFetch?: boolean;
}

export function useProgrammeDetail(
  slug: string | null | undefined,
  options: UseProgrammeDetailOptions = {},
): UseProgrammeDetailResult {
  const { includeFullResponse = false, autoFetch = true } = options;

  const [programme, setProgramme] = useState<Programme | null>(null);
  const [fullResponse, setFullResponse] = useState<ProgramDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgrammeDetail = useCallback(async () => {
    if (!slug) {
      setError("Program slug is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (includeFullResponse) {
        const response = await getProgrammeDetail(slug);

        setFullResponse(response);
        setProgramme(response.data.program);
      } else {
        const program = await getProgrammeBySlug(slug);

        setProgramme(program);
        setFullResponse(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch program details";

      setError(errorMessage);
      setProgramme(null);
      setFullResponse(null);
    } finally {
      setLoading(false);
    }
  }, [slug, includeFullResponse]);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    if (!slug) {
      return;
    }

    let cancelled = false;

    const loadProgrammeDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        if (includeFullResponse) {
          const response = await getProgrammeDetail(slug);

          if (cancelled) {
            return;
          }

          setFullResponse(response);
          setProgramme(response.data.program);
        } else {
          const program = await getProgrammeBySlug(slug);

          if (cancelled) {
            return;
          }

          setProgramme(program);
          setFullResponse(null);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }

        const errorMessage = err instanceof Error ? err.message : "Failed to fetch program details";

        setError(errorMessage);
        setProgramme(null);
        setFullResponse(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProgrammeDetail();

    return () => {
      cancelled = true;
    };
  }, [slug, autoFetch, includeFullResponse]);

  return {
    programme,
    loading,
    error,
    refetch: fetchProgrammeDetail,
    fullResponse,
  };
}

/**
 * Simplified hook that only returns the program data
 */
export function useProgramme(slug: string | null | undefined) {
  return useProgrammeDetail(slug, {
    includeFullResponse: false,
    autoFetch: true,
  });
}

/**
 * Hook that returns full program detail response including tags,
 * related programs, etc.
 */
export function useProgrammeWithDetails(slug: string | null | undefined) {
  return useProgrammeDetail(slug, {
    includeFullResponse: true,
    autoFetch: true,
  });
}
