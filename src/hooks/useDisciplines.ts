"use client";

import { useEffect, useState } from "react";

import { getDisciplines } from "@/services/discipline.service";
import type { Discipline } from "@/types/discipline";

export const useDisciplines = () => {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getDisciplines();

        setDisciplines(data);
      } catch (err) {
        console.error("Failed to fetch disciplines:", err);
        setError("Unable to fetch disciplines.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisciplines();
  }, []);

  return {
    disciplines,
    isLoading,
    error,
  };
};
