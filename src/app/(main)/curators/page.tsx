import CuratorsPageClient from "./CuratorsPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Curators",
  description:
    "The artists, scholars and practitioners shaping the 2026 edition — across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual Arts and Special Projects.",
  pathname: "/curators",
  keywords: ["festival curators", "artists", "arts practitioners", "Goa"],
});

export default function Page() {
  return <CuratorsPageClient />;
}
