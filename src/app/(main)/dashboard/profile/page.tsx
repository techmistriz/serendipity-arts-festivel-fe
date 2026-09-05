import { ProfileDashboardPageClient } from "../ProfileDashboardPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard Profile",
  description: "Manage your Serendipity Arts Festival account profile.",
  pathname: "/dashboard/profile",
  noIndex: true,
});

export default function ProfileDashboardPage() {
  return <ProfileDashboardPageClient />;
}
