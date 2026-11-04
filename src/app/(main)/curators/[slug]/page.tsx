import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/common/JsonLd";
import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { generateCuratorDetailSchema } from "@/lib/seo/curator-schema";
import { getServerApiData } from "@/network/server-api";

import { CuratorDetailPageContent } from "../CuratorDetailPageContent";
import type { CuratorDetail, CuratorDetailData } from "../types";

async function getCuratorDetail(slug: string): Promise<CuratorDetailData | null> {
  return getServerApiData<CuratorDetailData>(`/curator/${encodeURIComponent(slug)}`);
}

function getCuratorDescription(curator: CuratorDetail): string {
  return (
    curator.meta_description ||
    curator.short_description ||
    textFromHtml(curator.bio) ||
    `Meet ${curator.name}, curator at Serendipity Arts Festival 2026.`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getCuratorDetail(slug);
  const curator: CuratorDetail | undefined = detail?.curator;

  if (!curator) {
    return createPageMetadata({
      title: "Curator",
      description: "Meet the curators of Serendipity Arts Festival 2026.",
      pathname: `/curators/${slug}`,
      noIndex: true,
    });
  }

  const description = getCuratorDescription(curator);

  const keywords = (curator.meta_keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return createPageMetadata({
    title: curator.meta_title || curator.name,
    description,
    pathname: `/curators/${slug}`,
    keywords,
    image: curator.curator_image,
  });
}

export default async function CuratorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getCuratorDetail(slug);

  if (!detail) {
    notFound();
  }

  const description = getCuratorDescription(detail.curator);

  const schema = generateCuratorDetailSchema({
    data: detail,
    slug,
    description,
  });

  return (
    <>
      <JsonLd schema={schema} />
      <CuratorDetailPageContent detail={detail} />
    </>
  );
}
