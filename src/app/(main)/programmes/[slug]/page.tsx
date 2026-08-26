import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { getServerApiData } from "@/network/server-api";
import type { Programme } from "@/types/programme";

import { ProgrammeDetailPageClient } from "../ProgrammeDetailPageClient";
import { CATEGORY_SLUGS } from "../constants";

type ProgrammeMetadataData = {
  program?: Programme;
};

async function getProgrammeMetadata(slug: string): Promise<Programme | null> {
  const data = await getServerApiData<ProgrammeMetadataData>(
    `/programme/${encodeURIComponent(slug)}`,
  );

  return data?.program ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getProgrammeMetadata(slug);

  if (!programme) {
    return createPageMetadata({
      title: "Programme",
      description: "Discover programmes at Serendipity Arts Festival 2026 in Panjim, Goa.",
      pathname: `/programmes/${slug}`,
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
    pathname: `/programmes/${slug}`,
    keywords,
    image: programme.program_image,
  });
}

export default async function ProgrammeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
}) {
  const { slug } = await params;

  if (CATEGORY_SLUGS[slug]) {
    redirect(`/programmes/category/${encodeURIComponent(slug)}`);
  }

  const { intent } = await searchParams;
  const initialIntent = intent === "cart" ? "cart" : "about";

  return <ProgrammeDetailPageClient slug={slug} initialIntent={initialIntent} />;
}
