import { ArtPassDashboardPageClient } from "../ArtPassDashboardPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard Art Pass",
  description: "View and download your Serendipity Arts Festival Art Pass.",
  pathname: "/dashboard/art-pass",
  noIndex: true,
});

export default function ArtPassDashboardPage() {
  return <ArtPassDashboardPageClient />;
}
