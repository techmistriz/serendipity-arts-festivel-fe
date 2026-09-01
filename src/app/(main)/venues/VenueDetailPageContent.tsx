import Link from "next/link";

import { SanitizedRichText } from "@/components/common/SanitizedRichText";
import GlitchBar from "@/components/common/GlitchBar";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { getSafeExternalUrl } from "@/utils/url";

import { VenueImage } from "./_components/VenueImage";
import { VenueProgrammes } from "./_components/VenueProgrammes";
import { VenueSubVenues } from "./_components/VenueSubVenues";
import type { VenueDetail } from "./types";

type VenueDetailPageContentProps = {
  venue: VenueDetail;
};

export function VenueDetailPageContent({ venue }: VenueDetailPageContentProps) {
  const directionsUrl = getSafeExternalUrl(venue.google_map_url);

  return (
    <div className="container-editorial relative py-10 pb-24 md:pb-32">
      {/* Left glitch edge */}
      <GlitchBar
        seed={17}
        direction="v"
        variant="bulge"
        speed={1.6}
        count={80}
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-1.5"
      />

      {/* Right glitch edge */}
      <GlitchBar
        seed={37}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={80}
        className="pointer-events-none absolute top-0 right-0 bottom-0 w-1.5"
      />

      <div className="pt-6 pb-16 md:pt-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <p className="label">Venue</p>

          <Link href="/venues" className="label transition-colors hover:text-accent">
            Close ×
          </Link>
        </div>

        {/* Venue Details */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-12 md:gap-10">
          {/* Image */}
          <div className="md:col-span-6">
            <GlitchBorder
              seed={venue.title.length + 31}
              thickness={1}
              hoverBoost={14}
              delayMs={200}
              className="aspect-[4/3] overflow-hidden"
            >
              <VenueImage image={venue.featured_image} alt={venue.title} />
            </GlitchBorder>
          </div>

          {/* Content */}
          <div className="md:col-span-6">
            <h1 className="display text-4xl leading-[0.92] tracking-[-0.02em] uppercase md:text-7xl">
              {venue.title}
            </h1>

            <SanitizedRichText
              html={venue.description}
              className="headline mt-4 max-w-prose space-y-4 text-base leading-relaxed md:text-lg [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
            />

            <VenueSubVenues venues={venue.childs} />

            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="headline mt-8 inline-block border border-foreground px-6 py-3 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
              >
                Get directions →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Programmes */}
      <VenueProgrammes programs={venue.program_details} />
    </div>
  );
}
