import { VolunteerApplicationPageClient } from "./VolunteerApplicationPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Volunteer Application",
  description: "Apply to volunteer with Serendipity Arts Festival.",
  pathname: "/volunteer/apply",
  noIndex: true,
});

export default function VolunteerApplicationPage() {
  return <VolunteerApplicationPageClient />;
}
