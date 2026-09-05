import { ScheduleDashboardPageClient } from "../ScheduleDashboardPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "My Schedule",
  description: "View your Serendipity Arts Festival programme schedule.",
  pathname: "/dashboard/schedule",
  noIndex: true,
});

export default function ScheduleDashboardPage() {
  return <ScheduleDashboardPageClient />;
}
