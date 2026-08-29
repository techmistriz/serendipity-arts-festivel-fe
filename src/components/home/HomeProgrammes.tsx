"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useProgrammes } from "@/hooks/useProgrammes";
import { images } from "@/config/images";

import { GlitchBorder } from "../common/GlitchBorder";
import { RecommendModal } from "../common/RecommendModal";

export default function Programmes() {
  const [recOpen, setRecOpen] = useState(false);

  const { programmes, loading, error } = useProgrammes({ page: 1, limit: 8 });

  const sortedProgrammes = [...programmes].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <section
        className="tex-band container-editorial mt-20 md:mt-32 py-12 md:py-20"
        style={{ ["--tex-tint" as string]: "#CEDC2933" }}
      >
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
          <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
            Programmes
          </h2>

          {/* Recommendation Box */}
          <div className="paper-grain md:col-span-5 relative overflow-hidden">
            <Image
              src={images.home.recommendationBackground}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 42vw"
              className="object-cover"
              aria-hidden="true"
            />

            <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />

            <div className="relative z-10 px-7 py-8 md:px-9 md:py-10">
              <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
                Let us help you — recommend programmes
              </p>

              <button
                type="button"
                onClick={() => setRecOpen(true)}
                className="mt-4 label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors"
              >
                Start →
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index}>
                <div className="w-full aspect-square bg-muted animate-pulse" />

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-20 bg-muted animate-pulse" />
                  <div className="h-5 w-3/4 bg-muted animate-pulse" />
                  <div className="h-3 w-full bg-muted animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="border border-foreground p-6">
            <p className="headline text-sm">Unable to load programmes.</p>

            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Programmes */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-14">
              {sortedProgrammes.slice(0, 8).map((programme, index) => (
                <Link key={programme.id} href={`/programmes`} className="group block">
                  <GlitchBorder
                    seed={index + 5}
                    thickness={1}
                    hoverBoost={14}
                    delayMs={200}
                    className="overflow-hidden"
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <Image
                        src={programme.program_image}
                        alt={programme.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                  </GlitchBorder>

                  <div className="mt-3">
                    <p className="label text-muted-foreground">
                      {programme.category?.name ?? programme.discipline?.name ?? "Programme"}
                    </p>

                    <h3 className="mt-1.5 headline font-semibold text-sm md:text-lg leading-tight tracking-[-0.01em] group-hover:text-accent transition-colors">
                      {programme.name}
                    </h3>

                    <p className="mt-1 text-[11px] md:text-xs text-muted-foreground headline">
                      {programme.program_city?.name ?? "Goa"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex justify-end">
              <Link href="/programmes" className="label hover:text-accent transition-colors">
                All programmes &nbsp;→
              </Link>
            </div>
          </>
        )}
      </section>

      <RecommendModal open={recOpen} onClose={() => setRecOpen(false)} />
    </>
  );
}
