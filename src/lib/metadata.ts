import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMetadataInput = {
  title: string;
  description: string;
  pathname?: string;
  keywords?: string[];
  image?: string | null;
  noIndex?: boolean;
};

const defaultKeywords = [
  "Serendipity Arts Festival",
  "SAF 2026",
  "Goa arts festival",
  "Panjim",
  "India arts festival",
];

function withSiteName(title: string) {
  return title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
}

/** Create consistent metadata for static and catalogue pages. */
export function createPageMetadata({
  title,
  description,
  pathname,
  keywords = [],
  image,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const fullTitle = withSiteName(title);
  const metadataTitle = title.includes(siteConfig.name) ? { absolute: title } : title;

  return {
    title: metadataTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: pathname ? { canonical: pathname } : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: pathname,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Remove HTML before using CMS copy in metadata. */
export function textFromHtml(value: string | null | undefined) {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
