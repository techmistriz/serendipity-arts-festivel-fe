import type { Metadata } from "next";

import { ProgrammeDetailPageClient } from "../ProgrammeDetailPageClient";
import { ProgrammesPageClient } from "../ProgrammesPageClient";
import { CATEGORY_SLUGS } from "../constants";
import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { getServerApiData } from "@/network/server-api";
import type { Programme } from "@/types/programme";

type ProgrammeMetadataData = {
  program?: Programme;
};

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));
}

async function getProgrammeMetadata(slug: string): Promise<Programme | null> {
  const data = await getServerApiData<ProgrammeMetadataData>(
    `/programme/${encodeURIComponent(slug)}`,
  );

  return data?.program ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: segment } = await params;
  const category = CATEGORY_SLUGS[segment];

  if (category) {
    return createPageMetadata({
      title: `${category} Programmes`,
      description: `Discover ${category.toLowerCase()} programmes at Serendipity Arts Festival 2026 in Panjim, Goa.`,
      pathname: `/programmes/${segment}`,
      keywords: [category, "festival programmes", "Goa"],
    });
  }

  const programme = await getProgrammeMetadata(segment);

  if (!programme) {
    return createPageMetadata({
      title: "Programme",
      description: "Discover programmes at Serendipity Arts Festival 2026 in Panjim, Goa.",
      pathname: `/programmes/${segment}`,
      noIndex: true,
    });
  }

  const description =
    programme.meta_description ||
    textFromHtml(programme.short_description) ||
    textFromHtml(programme.description) ||
    `Discover ${programme.name} at Serendipity Arts Festival 2026.`;
  const keywords = (programme.meta_keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return createPageMetadata({
    title: programme.meta_title || programme.name,
    description,
    pathname: `/programmes/${segment}`,
    keywords,
    image: programme.program_image,
  });
}

export default async function ProgrammeCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const { category: categorySlug } = await params;
  const category = CATEGORY_SLUGS[categorySlug];

  if (category) {
    return <ProgrammesPageClient initialCategory={category} />;
  }

  const { intent } = await searchParams;
  const initialIntent = intent === "cart" ? "cart" : "about";

  return <ProgrammeDetailPageClient slug={categorySlug} initialIntent={initialIntent} />;
}
