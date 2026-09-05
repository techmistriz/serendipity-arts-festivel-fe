import { IconsPageClient } from "./IconsPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Icon Library",
  description: "Internal Serendipity Arts Festival icon library.",
  pathname: "/icons",
  noIndex: true,
});

export default function IconsPage() {
  return <IconsPageClient />;
}
