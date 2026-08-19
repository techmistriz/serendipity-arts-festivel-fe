"use client";

import { useState } from "react";

import GlitchBar from "@/components/common/GlitchBar";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/Modal";
import { sanitizeRichText } from "@/utils/html";
import { getSafeExternalUrl } from "@/utils/url";

import type { VenueDetail } from "../types";
import { VenueImage } from "./VenueImage";
import { VenueProgrammes } from "./VenueProgrammes";

type VenueDetailModalProps = {
  activeVenue: VenueDetail | null;
  onClose: () => void;
};

export function VenueDetailModal({ activeVenue, onClose }: VenueDetailModalProps) {
  return (
    <Modal open={Boolean(activeVenue)} onOpenChange={(open) => !open && onClose()}>
      {activeVenue && (
        <VenueDetailContent key={activeVenue.id} venue={activeVenue} onClose={onClose} />
      )}
    </Modal>
  );
}

function VenueDetailContent({ venue, onClose }: { venue: VenueDetail; onClose: () => void }) {
  const [selectedSubVenue, setSelectedSubVenue] = useState(0);
  const directionsUrl = getSafeExternalUrl(venue.google_map_url);

  return (
    <ModalContent
      showCloseButton={false}
      className="max-h-[calc(100dvh-2rem)] max-w-6xl gap-0 overflow-y-auto p-0"
    >
      <GlitchBar
        seed={17}
        direction="v"
        variant="bulge"
        speed={1.6}
        count={80}
        className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1.5"
      />
      <GlitchBar
        seed={37}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={80}
        className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-1.5"
      />

      <div className="container-editorial relative px-6 pt-6 pb-16 md:px-10 md:pt-10">
        <ModalHeader className="flex flex-row items-center justify-between border-b border-rule pb-4">
          <p className="label">Venue</p>
          <ModalClose asChild>
            <button type="button" className="label transition-colors hover:text-accent">
              Close ×
            </button>
          </ModalClose>
        </ModalHeader>
        <ModalTitle className="sr-only">{venue.title}</ModalTitle>
        <ModalDescription className="sr-only">Details for {venue.title}</ModalDescription>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <GlitchBorder
              seed={venue.title.length + 31}
              thickness={1}
              hoverBoost={14}
              delayMs={200}
              className="overflow-hidden"
            >
              <VenueImage image={venue.featured_image} alt={venue.title} />
            </GlitchBorder>
          </div>

          <div className="md:col-span-6">
            <h2 className="display text-3xl leading-[0.92] tracking-[-0.02em] uppercase md:text-6xl">
              {venue.title}
            </h2>

            {venue.description && (
              <div
                className="headline mt-4 max-w-prose space-y-4 text-base leading-relaxed md:text-lg [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(venue.description) }}
              />
            )}

            {venue.childs.length > 0 && (
              <div className="mt-8">
                <p className="label mb-3 text-muted-foreground">Sub-venues</p>
                <div className="flex flex-wrap gap-2">
                  {venue.childs.map((child, index) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedSubVenue(index)}
                      aria-pressed={selectedSubVenue === index}
                      className={`headline border px-3 py-2 text-xs tracking-[0.06em] uppercase transition-colors ${
                        selectedSubVenue === index
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {child.title}
                    </button>
                  ))}
                </div>
                <p className="headline mt-4 text-sm text-muted-foreground">
                  Selected:{" "}
                  <span className="text-foreground">{venue.childs[selectedSubVenue]?.title}</span>
                </p>
              </div>
            )}

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

        <VenueProgrammes programs={venue.program_details} onNavigate={onClose} />
      </div>
    </ModalContent>
  );
}
