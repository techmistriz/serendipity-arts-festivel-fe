import { AppPageClient } from "./AppPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Festival App",
  description:
    "Stay connected to Serendipity Arts Festival 2026 with programme updates, bookings and festival information.",
  pathname: "/app",
  keywords: ["Serendipity Arts Festival app", "festival updates", "festival bookings"],
});

export default function AppPage() {
  return <AppPageClient />;
}
