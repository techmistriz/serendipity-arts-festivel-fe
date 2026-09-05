"use client";

import { useMemo } from "react";

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

import type { CuratorDetailData } from "../types";
import { CuratorImage } from "./CuratorImage";
import { CuratorProgrammes } from "./CuratorProgrammes";

type CuratorDetailModalProps = {
  activeCurator: CuratorDetailData | null;
  onClose: () => void;
};

export function CuratorDetailModal({ activeCurator, onClose }: CuratorDetailModalProps) {
  const curator = activeCurator?.curator;
  const sanitizedBio = useMemo(
    () => (curator?.bio ? sanitizeRichText(curator.bio) : null),
    [curator],
  );
  const instagramUrl = getSafeExternalUrl(curator?.instagram_link);

  return (
    <Modal open={Boolean(activeCurator)} onOpenChange={(open) => !open && onClose()}>
      {curator && (
        <ModalContent
          showCloseButton={false}
          className="max-h-[calc(100dvh-2rem)] max-w-6xl gap-0 overflow-y-auto p-0"
        >
          <GlitchBar
            seed={13}
            direction="v"
            variant="vibrate"
            speed={0.35}
            count={90}
            className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-1.5"
          />
          <GlitchBar
            seed={31}
            direction="v"
            variant="bulge"
            speed={1.8}
            count={90}
            className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-1.5"
          />

          <div className="container-editorial relative px-6 pt-6 pb-16 md:px-10 md:pt-10">
            <ModalHeader className="flex flex-row items-center justify-between border-b border-rule pb-4">
              <p className="label">Curator</p>
              <ModalClose asChild>
                <button type="button" className="label transition-colors hover:text-accent">
                  Close ×
                </button>
              </ModalClose>
            </ModalHeader>
            <ModalTitle className="sr-only">{curator.name}</ModalTitle>
            <ModalDescription className="sr-only">Details for {curator.name}</ModalDescription>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-5">
                <GlitchBorder
                  seed={curator.name.length + 23}
                  thickness={1}
                  hoverBoost={14}
                  delayMs={200}
                  className="overflow-hidden"
                >
                  <CuratorImage image={curator.curator_image} alt={curator.name} />
                </GlitchBorder>
              </div>

              <div className="md:col-span-7">
                {curator.discipline && (
                  <p className="label text-muted-foreground">{curator.discipline.name}</p>
                )}

                <h2 className="display mt-2 text-3xl leading-[0.92] tracking-[-0.02em] uppercase md:text-6xl">
                  {curator.name}
                </h2>

                {curator.short_description && (
                  <p className="headline mt-6 max-w-prose text-base leading-relaxed md:text-lg">
                    {curator.short_description}
                  </p>
                )}

                {sanitizedBio && (
                  <div
                    className="headline mt-6 max-w-prose space-y-4 text-base leading-relaxed md:text-lg [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                    dangerouslySetInnerHTML={{ __html: sanitizedBio }}
                  />
                )}

                {(instagramUrl || curator.instagram_handle) && (
                  <div className="mt-8">
                    {instagramUrl ? (
                      <a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="headline inline-block border border-foreground px-5 py-3 text-xs tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background"
                      >
                        {curator.instagram_handle || "Instagram"} →
                      </a>
                    ) : (
                      <span className="headline inline-block border border-foreground px-5 py-3 text-xs tracking-[0.06em] uppercase">
                        {curator.instagram_handle}
                      </span>
                    )}
                  </div>
                )}

                <CuratorProgrammes programs={activeCurator.programs} onNavigate={onClose} />
              </div>
            </div>
          </div>
        </ModalContent>
      )}
    </Modal>
  );
}
