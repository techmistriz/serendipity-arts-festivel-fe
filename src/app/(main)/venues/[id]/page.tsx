import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/common/JsonLd";
import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { generateVenueDetailSchema } from "@/lib/seo/venue-schema";
import { getServerApiData } from "@/network/server-api";
import type { VenueDetail } from "@/types/venue";

import { VenueDetailPageContent } from "../VenueDetailPageContent";

async function getVenueDetail(id: string): Promise<VenueDetail | null> {
  return getServerApiData<VenueDetail>(`/venue-detail/${encodeURIComponent(id)}`);
}

function getVenueDescription(venue: VenueDetail): string {
  return (
    venue.meta_description ||
    textFromHtml(venue.description) ||
    `Discover ${venue.title}, a Serendipity Arts Festival venue in Panjim, Goa.`
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const venue = await getVenueDetail(id);
  const pathname = `/venues/${encodeURIComponent(id)}`;

  if (!venue) {
    return createPageMetadata({
      title: "Venue",
      description: "Explore Serendipity Arts Festival venues across Panjim, Goa.",
      pathname,
      noIndex: true,
    });
  }

  const description = getVenueDescription(venue);

  const keywords = (venue.meta_keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return createPageMetadata({
    title: venue.meta_title || venue.title,
    description,
    pathname,
    keywords,
    image: venue.featured_image,
  });
}

export default async function VenueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = await getVenueDetail(id);

  if (!venue) {
    notFound();
  }

  const schema = generateVenueDetailSchema({
    venue,
    slug: id,
    description: getVenueDescription(venue),
  });

  return (
    <>
      <JsonLd schema={schema} />
      <VenueDetailPageContent venue={venue} />
    </>
  );
}
