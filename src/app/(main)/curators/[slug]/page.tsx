import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { getServerApiData } from "@/network/server-api";

import { CuratorDetailPageContent } from "../CuratorDetailPageContent";
import type { CuratorDetail, CuratorDetailData } from "../types";

async function getCuratorDetail(slug: string): Promise<CuratorDetailData | null> {
  return getServerApiData<CuratorDetailData>(`/curator/${encodeURIComponent(slug)}`);
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

  const description =
    curator.meta_description ||
    curator.short_description ||
    textFromHtml(curator.bio) ||
    `Meet ${curator.name}, curator at Serendipity Arts Festival 2026.`;
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

  return <CuratorDetailPageContent detail={detail} />;
}
