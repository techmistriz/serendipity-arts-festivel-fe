"use client";

import { useEffect, useState } from "react";

import { getTestimonials } from "@/services/testimonial.service";
import type { Testimonial } from "@/types/testimonial";

export function useTestimonials(limit?: number) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getTestimonials(limit);

        if (mounted) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);

        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch testimonials");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return {
    testimonials,
    loading,
    error,
  };
}
