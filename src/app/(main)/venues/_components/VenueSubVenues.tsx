"use client";

import { useState } from "react";

import type { VenueChild } from "../types";

type VenueSubVenuesProps = {
  venues: VenueChild[];
};

export function VenueSubVenues({ venues }: VenueSubVenuesProps) {
  const [selectedVenueIndex, setSelectedVenueIndex] = useState(0);

  if (venues.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="label mb-3 text-muted-foreground">Sub-venues</p>
      <div className="flex flex-wrap gap-2">
        {venues.map((venue, index) => (
          <button
            key={venue.id}
            type="button"
            onClick={() => setSelectedVenueIndex(index)}
            aria-pressed={selectedVenueIndex === index}
            className={`headline border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
              selectedVenueIndex === index
                ? "border-foreground bg-foreground text-background"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {venue.title}
          </button>
        ))}
      </div>
      <p className="headline mt-4 text-sm text-muted-foreground">
        Selected: <span className="text-foreground">{venues[selectedVenueIndex]?.title}</span>
      </p>
    </div>
  );
}
