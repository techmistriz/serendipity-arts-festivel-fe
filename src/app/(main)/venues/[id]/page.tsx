import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { createPageMetadata, textFromHtml } from "@/lib/metadata";
import { getServerApiData } from "@/network/server-api";

import { VenueDetailPageContent } from "../VenueDetailPageContent";
import type { VenueDetail } from "../types";

async function getVenueDetail(id: string): Promise<VenueDetail | null> {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  return getServerApiData<VenueDetail>(`/venue-detail/${id}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const venue = await getVenueDetail(id);

  if (!venue) {
    return createPageMetadata({
      title: "Venue",
      description: "Explore Serendipity Arts Festival venues across Panjim, Goa.",
      pathname: `/venues/${id}`,
      noIndex: true,
    });
  }

  const description =
    venue.meta_description ||
    textFromHtml(venue.description) ||
    `Discover ${venue.title}, a Serendipity Arts Festival venue in Panjim, Goa.`;
  const keywords = (venue.meta_keywords ?? "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  return createPageMetadata({
    title: venue.meta_title || venue.title,
    description,
    pathname: `/venues/${id}`,
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

  return <VenueDetailPageContent venue={venue} />;
}
