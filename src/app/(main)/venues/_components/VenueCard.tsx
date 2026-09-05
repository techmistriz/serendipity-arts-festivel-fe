import Link from "next/link";

import { GlitchBorder } from "@/components/common/GlitchBorder";
import { stripHtml } from "@/utils/html";

import type { VenueListItem } from "../types";
import { VenueImage } from "./VenueImage";

type VenueCardProps = {
  venue: VenueListItem;
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      href={`/venues/${encodeURIComponent(venue.slug)}`}
      aria-label={`View details for ${venue.title}`}
      className="group block text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <GlitchBorder
        seed={venue.title.length + 9}
        thickness={1}
        hoverBoost={14}
        delayMs={200}
        className="aspect-[4/3] overflow-hidden"
      >
        <VenueImage image={venue.featured_image} alt={venue.title} />
      </GlitchBorder>

      <h2 className="display mt-4 break-words text-2xl leading-[0.95] tracking-[-0.02em] uppercase transition-colors group-hover:text-accent md:text-4xl">
        {venue.title}
      </h2>

      {venue.description && (
        <p className="headline mt-2 line-clamp-2 text-sm text-muted-foreground">
          {stripHtml(venue.description)}
        </p>
      )}

      <span className="headline mt-3 inline-block border border-foreground px-3 py-1.5 text-[11px] tracking-[0.08em] uppercase transition-colors group-hover:bg-foreground group-hover:text-background">
        More info +
      </span>
    </Link>
  );
}
