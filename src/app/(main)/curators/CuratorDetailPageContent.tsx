import Link from "next/link";

import GlitchBar from "@/components/common/GlitchBar";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { getSafeExternalUrl } from "@/utils/url";

import { CuratorBio } from "./_components/CuratorBio";
import { CuratorImage } from "./_components/CuratorImage";
import { CuratorProgrammes } from "./_components/CuratorProgrammes";
import type { CuratorDetailData } from "./types";

type CuratorDetailPageContentProps = {
  detail: CuratorDetailData;
};

export function CuratorDetailPageContent({ detail }: CuratorDetailPageContentProps) {
  const { curator, programs } = detail;
  const instagramUrl = getSafeExternalUrl(curator.instagram_link);

  return (
    <div className="container-editorial relative py-10 pb-24 md:pt-16 md:pb-32">
      <GlitchBar
        seed={13}
        direction="v"
        variant="vibrate"
        speed={0.35}
        count={90}
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-1.5"
      />

      <Link href="/curators" className="label inline-block transition-colors hover:text-accent">
        ← All curators
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-12 md:gap-10">
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

          <h1 className="display mt-2 text-4xl leading-[0.92] tracking-[-0.02em] uppercase md:text-7xl">
            {curator.name}
          </h1>

          {curator.short_description && (
            <p className="headline mt-6 max-w-prose text-base leading-relaxed md:text-lg">
              {curator.short_description}
            </p>
          )}

          <CuratorBio key={curator.bio ?? curator.id} bio={curator.bio} />

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

          <CuratorProgrammes programs={programs} />
        </div>
      </div>
    </div>
  );
}
