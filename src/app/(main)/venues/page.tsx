import VenuesPageClient from "./VenuesPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Venues",
  description: "Explore heritage buildings and purpose-built festival spaces across Panjim, Goa.",
  pathname: "/venues",
  keywords: ["festival venues", "Panjim", "Goa venues", "heritage venues"],
});

export default function Page() {
  return <VenuesPageClient />;
}
