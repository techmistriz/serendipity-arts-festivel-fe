import { PartnersPageClient } from "./PartnersPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Partners",
  description:
    "Meet the partners supporting Serendipity Arts Festival 2026, including the Government of Goa, cultural organisations and civic institutions.",
  pathname: "/partners",
  keywords: ["festival partners", "arts supporters", "Serendipity Arts Festival partners"],
});

export default function PartnersPage() {
  return <PartnersPageClient />;
}
