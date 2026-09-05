import { Suspense } from "react";

import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";

import { ProgrammesListContent } from "./ProgrammesListContent";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Programmes",
  description:
    "Explore performances, exhibitions, workshops, talks and film screenings at Serendipity Arts Festival 2026 in Panjim, Goa.",
  pathname: "/programmes",
  keywords: ["programmes", "performances", "exhibitions", "workshops", "talks", "film screenings"],
});

export default function ProgrammesPage() {
  return (
    <Suspense fallback={<RouteLoadingOverlay label="Loading programmes" />}>
      <ProgrammesListContent />
    </Suspense>
  );
}
