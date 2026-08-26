import { AboutPageClient } from "./AboutPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn about Serendipity Arts Festival, an annual multidisciplinary arts festival in Panjim, Goa.",
  pathname: "/about",
  keywords: ["about Serendipity Arts Festival", "multidisciplinary arts festival", "Goa"],
});

export default function AboutPage() {
  return <AboutPageClient />;
}
