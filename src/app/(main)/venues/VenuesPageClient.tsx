"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AsyncErrorAlert, EmptyState, LoadingState } from "@/components/common/AsyncState";
import { getErrorMessage } from "@/utils/error";

import { getVenueDetail, getVenues } from "./api";
import { VenueCard } from "./_components/VenueCard";
import { VenueDetailModal } from "./_components/VenueDetailModal";
import type { VenueDetail, VenueListItem } from "./types";

export default function VenuesPageClient() {
  const [venues, setVenues] = useState<VenueListItem[]>([]);
  const [activeVenue, setActiveVenue] = useState<VenueDetail | null>(null);
  const [lastSelectedVenue, setLastSelectedVenue] = useState<VenueListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  const detailCache = useRef(new Map<number, VenueDetail>());

  function initializeVenues() {
    void getVenues()
      .then(setVenues)
      .catch((error: unknown) => {
        setListError(getErrorMessage(error, "Unable to load venues. Please try again."));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    initializeVenues();
  }, []);

  const openVenue = useCallback(async (venue: VenueListItem) => {
    setLastSelectedVenue(venue);
    setDetailError(null);

    const cachedDetail = detailCache.current.get(venue.id);
    if (cachedDetail) {
      setActiveVenue(cachedDetail);
      return;
    }

    setDetailLoading(true);

    try {
      const detail = await getVenueDetail(venue.id);

      detailCache.current.set(venue.id, detail);
      setActiveVenue(detail);
    } catch (error) {
      setDetailError(getErrorMessage(error, "Unable to load venue details. Please try again."));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const retryVenues = () => {
    setLoading(true);
    setListError(null);
    initializeVenues();
  };

  const retryVenueDetail = () => {
    if (lastSelectedVenue) {
      void openVenue(lastSelectedVenue);
    }
  };

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
      {detailError && (
        <AsyncErrorAlert
          title="Venue details are unavailable"
          error={detailError}
          onRetry={retryVenueDetail}
          retryDisabled={!lastSelectedVenue}
          className="mt-6"
        />
      )}

      {loading ? (
        <LoadingState label="Loading venues" variant="inline" />
      ) : venues.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-10">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onOpen={(selectedVenue) => void openVenue(selectedVenue)}
              disabled={detailLoading}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No venues are available yet" />
      )}

      {detailLoading && <LoadingState label="Loading venue details" variant="overlay" />}

      <VenueDetailModal activeVenue={activeVenue} onClose={() => setActiveVenue(null)} />
    </div>
  );
}
