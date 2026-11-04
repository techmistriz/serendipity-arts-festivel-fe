import JsonLd from "@/components/common/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { generateVenueListSchema } from "@/lib/seo/venue-schema";
import { getServerApiData } from "@/network/server-api";
import type { VenueListItem } from "@/types/venue";

import VenuesPageClient from "./VenuesPageClient";

export const metadata = createPageMetadata({
  title: "Venues",
  description: "Explore heritage buildings and purpose-built festival spaces across Panjim, Goa.",
  pathname: "/venues",
  keywords: ["festival venues", "Panjim", "Goa venues", "heritage venues"],
});

export default async function Page() {
  const venues = await getServerApiData<VenueListItem[]>("/venues");

  return (
    <>
      {venues && <JsonLd schema={generateVenueListSchema(venues)} />}
      <VenuesPageClient initialVenues={venues} />
    </>
  );
}
