import { ContactPageClient } from "./ContactPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact the Serendipity Arts Festival team for festival information, partnerships and general enquiries.",
  pathname: "/contact",
  keywords: ["contact Serendipity Arts Festival", "festival enquiries", "partnerships"],
});

export default function ContactPage() {
  return <ContactPageClient />;
}
