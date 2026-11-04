import type { Metadata } from "next";

import JsonLd from "@/components/common/JsonLd";
import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { generateProgrammeDetailSchema } from "@/lib/seo/programme-schema";
import { getServerApiData } from "@/network/server-api";
import type { ProgramDetailResponse } from "@/types/programme";

import { ProgrammeDetailPageClient } from "./ProgrammeDetailPageClient";

type ProgrammeDetailData = ProgramDetailResponse["data"];

async function getProgrammeDetail(slug: string): Promise<ProgrammeDetailData | null> {
  return getServerApiData<ProgrammeDetailData>(`/programme/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getProgrammeDetail(slug);
  const programme = detail?.program;

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
  const { intent } = await searchParams;

  const initialIntent = intent === "cart" ? "cart" : "about";

  const detail = await getProgrammeDetail(slug);

  const schema = detail?.program ? generateProgrammeDetailSchema(detail, slug) : null;

  return (
    <>
      {schema && <JsonLd schema={schema} />}

      <ProgrammeDetailPageClient slug={slug} initialIntent={initialIntent} />
    </>
  );
}
