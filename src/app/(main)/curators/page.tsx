import CuratorsPageClient from "./CuratorsPageClient";
import { createPageMetadata } from "@/lib/metadata";
import JsonLd from "@/components/common/JsonLd";
import { getServerApiData } from "@/network/server-api";
import { generateCuratorListSchema } from "@/lib/seo/curator-schema";
import type { CuratorListItem } from "@/types/curator";

export const metadata = createPageMetadata({
  title: "Curators",
  description:
    "The artists, scholars and practitioners shaping the 2026 edition — across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual Arts and Special Projects.",
  pathname: "/curators",
  keywords: ["festival curators", "artists", "arts practitioners", "Goa"],
});

export default async function Page() {
  const curators = (await getServerApiData<CuratorListItem[]>("/curators")) ?? [];

  const schema = generateCuratorListSchema(curators);

  return (
    <>
      <JsonLd schema={schema} />
      <CuratorsPageClient />
    </>
  );
}
