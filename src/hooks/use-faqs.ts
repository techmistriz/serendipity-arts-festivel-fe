"use client";

import { useCallback, useEffect, useState } from "react";

import { getFaqs } from "@/services/faq.service";
import type { Faq } from "@/types/faq";

export function useFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    setError(null);

    try {
      const data = await getFaqs();

      setFaqs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch FAQs.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadFaqs = async () => {
      try {
        const data = await getFaqs();

        if (!cancelled) {
          setFaqs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to fetch FAQs.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadFaqs();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    faqs,
    loading,
    error,
    refetch: fetchFaqs,
  };
}
