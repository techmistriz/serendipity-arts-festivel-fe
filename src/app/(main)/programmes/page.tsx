import { Suspense } from "react";

import JsonLd from "@/components/common/JsonLd";
import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";
import { createPageMetadata } from "@/lib/metadata";
import { generateProgrammeListSchema } from "@/lib/seo/programme-schema";
import { getServerApiData } from "@/network/server-api";
import type { ProgrammesListResponse } from "@/types/programme";

import { ProgrammesListContent } from "./ProgrammesListContent";

export const metadata = createPageMetadata({
  title: "Programmes",
  description:
    "Explore performances, exhibitions, workshops, talks and film screenings at Serendipity Arts Festival 2026 in Panjim, Goa.",
  pathname: "/programmes",
  keywords: ["programmes", "performances", "exhibitions", "workshops", "talks", "film screenings"],
});

async function getAllProgrammesForSchema() {
  type PaginatedData = ProgrammesListResponse["data"];

  const firstPage = await getServerApiData<PaginatedData>("/programmes");

  if (!firstPage) return [];

  const lastPage = Math.max(1, firstPage.last_page || 1);

  const remainingPages = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) => index + 2).map((page) =>
      getServerApiData<PaginatedData>(`/programmes?page=${page}`),
    ),
  );

  return [...firstPage.data, ...remainingPages.flatMap((page) => page?.data ?? [])];
}

export default async function ProgrammesPage() {
  const programmes = await getAllProgrammesForSchema();
  const schema = generateProgrammeListSchema(programmes);

  return (
    <>
      <JsonLd schema={schema} />

      <Suspense fallback={<RouteLoadingOverlay label="Loading programmes" />}>
        <ProgrammesListContent />
      </Suspense>
    </>
  );
}
