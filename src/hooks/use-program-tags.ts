"use client";

import { useEffect, useState } from "react";

import { getProgramTags } from "@/services/program-tag.service";
import type { ProgramTag } from "@/types/program-tag";

export function useProgramTags() {
  const [programTags, setProgramTags] = useState<ProgramTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProgramTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProgramTags();

        if (!mounted) return;

        setProgramTags(data);
      } catch (err) {
        console.error("Failed to fetch program tags:", err);

        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch program tags");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchProgramTags();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    programTags,
    loading,
    error,
  };
}
