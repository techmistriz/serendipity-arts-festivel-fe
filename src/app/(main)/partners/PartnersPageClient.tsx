"use client";

import Image from "next/image";

import GlitchBar from "@/components/common/GlitchBar";
import { LogoGridLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { FESTIVAL_LOGO, FOUNDATION_LOGO } from "@/data/partners";
import { useSponsors } from "@/hooks/useSponsors";

import { SponsorGrid } from "./_components/SponsorGrid";

export function PartnersPageClient() {
  const { sponsors, loading, error } = useSponsors(8);

  return (
    <div className="container-editorial relative pb-32 pt-10 md:pt-20">
      <GlitchBar
        seed={17}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={70}
        className="absolute left-0 top-20 bottom-32 hidden w-1 md:block"
      />

      <h1 className="display uppercase text-[13vw] leading-[0.9] md:text-[9vw]">Partners</h1>

      <h2 className="mt-16 md:mt-24 display uppercase text-2xl md:text-4xl leading-[1] rule-b pb-4">
        Supported by
      </h2>

      {loading ? (
        <LogoGridLoadingSkeleton label="Loading partners" />
      ) : error ? (
        <p role="alert" className="headline mt-8 text-sm text-muted-foreground">
          Partners are currently unavailable. Please try again later.
        </p>
      ) : sponsors.length === 0 ? (
        <p className="headline mt-8 text-sm text-muted-foreground">
          Partner information is coming soon.
        </p>
      ) : (
        <SponsorGrid sponsors={sponsors} />
      )}

      <h2 className="mt-16 md:mt-24 display uppercase text-2xl md:text-4xl leading-[1] rule-b pb-4">
        Presented by
      </h2>

      <div className="mt-8 border">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="grid min-h-[180px] place-items-center border-b p-6 md:min-h-[220px] md:border-b-0 md:border-r md:p-10">
            <Image
              src={FESTIVAL_LOGO}
              alt="Serendipity Arts Festival"
              loading="lazy"
              className="max-h-28 w-auto object-contain md:max-h-32"
            />
          </div>

          <div className="grid min-h-[180px] place-items-center p-6 md:min-h-[220px] md:p-10">
            <Image
              src={FOUNDATION_LOGO}
              alt="Serendipity Arts — Munjal Initiative for Creativity"
              loading="lazy"
              className="max-h-20 w-auto object-contain md:max-h-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
