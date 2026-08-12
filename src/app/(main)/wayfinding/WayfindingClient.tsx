"use client";

import Link from "next/link";
import { useMemo } from "react";

import { GOA_AREAS, GOA_NODES, GOA_ROADS, GOA_VENUE_POINTS, goaVenueSlug } from "@/src/lib/goa-map";
import { useCart } from "@/src/lib/cart";
import { WayfindingMap } from "@/src/components/WayfindingMap";

export default function WayfindingClient() {
  const { bookings } = useCart();

  const bookedVenueSlugs = useMemo(
    () =>
      Array.from(
        new Set(
          bookings
            .map((b) => goaVenueSlug(b.venue))
            .filter(Boolean) as string[]
        )
      ),
    [bookings]
  );

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-24">
      <h1 className="display uppercase text-[12vw] md:text-[9vw] leading-[0.9]">Wayfinding</h1>
      <div className="mt-8">
        <Link href="/dashboard" className="label notch border-[3px] border-black px-5 py-3 hover:text-accent">
          ← Back to dashboard
        </Link>
      </div>
      <div className="mt-10">
        <WayfindingMap
          ariaLabel="Map of Serendipity Arts Festival venues across Panjim"
          points={GOA_VENUE_POINTS}
          roads={GOA_ROADS}
          areas={GOA_AREAS}
          nodes={GOA_NODES}
          highlight={bookedVenueSlugs}
          caption="Panjim riverfront · all venues sit within a twenty minute walk. Highlighted squares are venues on your booking list."
        />
      </div>
    </div>
  );
}
