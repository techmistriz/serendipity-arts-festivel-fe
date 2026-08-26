import { PartnersPageClient } from "./PartnersPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Partners",
  description: "Meet the partners and supporters who help make Serendipity Arts Festival possible.",
  pathname: "/partners",
  keywords: ["festival partners", "arts supporters", "Serendipity Arts Festival partners"],
});

export default function PartnersPage() {
  return <PartnersPageClient />;
}
