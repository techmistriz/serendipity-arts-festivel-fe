import { DashboardPageClient } from "./DashboardPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description: "Manage your Serendipity Arts Festival account and bookings.",
  pathname: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardPageClient />;
}
