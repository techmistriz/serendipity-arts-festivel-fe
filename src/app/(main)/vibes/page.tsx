import VibesPageClient from "./VibesPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Vibes",
  description:
    "Cafés, bars and kitchens across Goa partnering with Serendipity Arts Festival 2026.",
  pathname: "/vibes",
  keywords: ["food and drink partners", "Goa restaurants", "Panjim cafes", "Goa bars"],
});

export default function Page() {
  return <VibesPageClient />;
}
