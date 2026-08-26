import { ProgrammesPageClient } from "./ProgrammesPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Programmes",
  description:
    "Explore performances, exhibitions, workshops, talks and film screenings at Serendipity Arts Festival 2026 in Panjim, Goa.",
  pathname: "/programmes",
  keywords: ["programmes", "performances", "exhibitions", "workshops", "talks", "film screenings"],
});

export default function ProgrammesPage() {
  return <ProgrammesPageClient />;
}
