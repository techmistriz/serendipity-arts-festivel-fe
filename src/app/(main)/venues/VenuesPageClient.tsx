"use client";

import { useState } from "react";

import { AsyncErrorAlert, EmptyState } from "@/components/common/AsyncState";
import { VenueGridLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { getVenues } from "@/services/venue.service";
import { getErrorMessage } from "@/utils/error";

import { VenueCard } from "./_components/VenueCard";
import type { VenueListItem } from "./types";
// import { GoogleWayfindingMap } from "@/components/maps/google-wayfinding-map";
// import { GOA_NODES, GOA_VENUE_POINTS } from "@/data/goa-map";
// import { useCart } from "@/hooks/use-cart";
// import { goaVenueSlug } from "@/lib/venue-slug";

type VenuesPageClientProps = {
  initialVenues: VenueListItem[] | null;
};

export default function VenuesPageClient({ initialVenues }: VenuesPageClientProps) {
  const [venues, setVenues] = useState<VenueListItem[]>(initialVenues ?? []);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(
    initialVenues === null ? "Unable to load venues. Please try again." : null,
  );

  async function initializeVenues() {
    try {
      const data = await getVenues();
      setVenues(data);
    } catch (error: unknown) {
      setListError(getErrorMessage(error, "Unable to load venues. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  const retryVenues = () => {
    setLoading(true);
    setListError(null);
    void initializeVenues();
  };

  // const { bookings } = useCart();

  // const bookedVenueSlugs = useMemo(
  //   () =>
  //     Array.from(new Set(bookings.map((b) => goaVenueSlug(b.venue)).filter(Boolean) as string[])),
  //   [bookings],
  // );

  return (
    <div className="container-editorial pt-10 pb-32 md:pt-20">
      <h1 className="display text-[13vw] leading-[0.9] uppercase md:text-[9vw]">Venues</h1>

      <p className="mt-6 max-w-3xl text-muted-foreground">
        The venues at the Serendipity Arts Festival range from heritage Goan buildings to
        purpose-built festival spaces, each offering a unique setting for performances, exhibitions,
        workshops, and more. Spread across Panjim&apos;s riverfront, the Festival transforms the
        city into a buzzing cultural hub — accessible to all.
      </p>

      {listError && (
        <AsyncErrorAlert
          title="Venues are unavailable"
          error={listError}
          onRetry={retryVenues}
          className="mt-10"
        />
      )}

      {loading ? (
        <VenueGridLoadingSkeleton />
      ) : venues.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-10">
          {venues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      ) : (
        <EmptyState message="No venues are available yet" />
      )}

      {/* <section className="mt-20 md:mt-28">
        <h2 className="display uppercase text-[9vw] md:text-[5vw] leading-[0.9]">Wayfinding</h2>
        <p className="mt-4 max-w-2xl text-muted-foreground headline text-sm">
          Pick a start and an end venue to get the route — on foot, by car or by transit.
        </p>
        <div className="mt-8">
          <GoogleWayfindingMap
            ariaLabel="Google map of Serendipity Arts Festival venues across Panjim"
            points={GOA_VENUE_POINTS}
            nodes={GOA_NODES}
            highlight={bookedVenueSlugs}
            caption="Panjim riverfront · all venues sit within a twenty minute walk. Highlighted pins are venues on your booking list."
          />
        </div>
      </section> */}
    </div>
  );
}
