import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { getPublicApiHeaders } from "@/network/api-headers";

import { CuratorDetailPageContent } from "../CuratorDetailPageContent";
import type { CuratorDetail, CuratorDetailData } from "../types";

type CuratorMetadataResponse = {
  status?: boolean;
  data?: CuratorDetailData;
};

async function getCuratorDetail(slug: string): Promise<CuratorDetailData | null> {
  try {
    const response = await fetch(
      `${siteConfig.api_base_url.replace(/\/$/, "")}/curator/${encodeURIComponent(slug)}`,
      {
        headers: getPublicApiHeaders(),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as CuratorMetadataResponse;

    return payload.status && payload.data?.curator ? payload.data : null;
  } catch {
    return null;
  }
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
