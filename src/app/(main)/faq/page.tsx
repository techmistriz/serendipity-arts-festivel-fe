import { createPageMetadata } from "@/lib/metadata";
import FaqPageClient from "./FaqPageClient";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Find answers about registration, Art Passes, programme bookings, accessibility and visiting Serendipity Arts Festival 2026.",
  pathname: "/faq",
  keywords: ["festival FAQ", "Art Pass", "programme booking", "festival accessibility"],
});

export default function FAQPage() {
  return <FaqPageClient />;
}
