"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProgrammesListContent } from "./ProgrammesListContent";

export function ProgrammesPageClient({ initialCategory = "All" }: { initialCategory?: string }) {
  return (
    <Suspense fallback={null}>
      <ProgrammesListRoute initialCategory={initialCategory} />
    </Suspense>
  );
}

function ProgrammesListRoute({ initialCategory }: { initialCategory: string }) {
  const searchParams = useSearchParams();
  const initialProgrammeId = searchParams.get("p");

  return (
    <ProgrammesListContent
      key={`${initialCategory}:${initialProgrammeId ?? ""}`}
      initialCategory={initialCategory}
      initialProgrammeId={initialProgrammeId}
    />
  );
}
