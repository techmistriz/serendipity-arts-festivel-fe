"use client";

import type { VenueChild } from "../types";

type VenueSubVenuesProps = {
  venues: VenueChild[];
  selectedVenueIndex: number;
  onSelect: (index: number) => void;
};

export function VenueSubVenues({ venues, selectedVenueIndex, onSelect }: VenueSubVenuesProps) {
  if (venues.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="label mb-3 text-muted-foreground">Sub-venues</p>

      <div className="flex flex-wrap gap-2">
        {venues.map((venue, index) => (
          <button
            key={venue.id}
            type="button"
            onClick={() => onSelect(index)}
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
