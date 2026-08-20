"use client";

import Image from "next/image";
import Link from "next/link";

import { GlitchBorder } from "@/components/common/GlitchBorder";
import { homeImages } from "@/config/images";
import { useCurators } from "@/hooks/useCurators";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";

interface CuratorsSectionProps {
  limit?: number;
}

export function CuratorsSection({ limit = 4 }: CuratorsSectionProps) {
  const { curators, loading, error } = useCurators(limit);

  return (
    <section className="container-editorial mt-20 md:mt-32">
      <HomeSectionHeader title="Curators">
        <a
          href="https://serendipityarts.org/curator-overview/"
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-5"
        >
          <HomePromoPanel image={homeImages.curatorsBox}>
            <p className="notch text-xl leading-[1] font-semibold tracking-[-0.01em] text-white uppercase md:text-2xl">
              Meet the festival curators over the years
            </p>

            <span className="label notch mt-4 inline-block border border-white px-4 py-2.5 text-white transition-colors hover:bg-white hover:text-foreground">
              Curator overview →
            </span>
          </HomePromoPanel>
        </a>
      </HomeSectionHeader>

      {loading ? (
        <div className="py-10 text-sm uppercase">
          Loading curators...
        </div>
      ) : error ? (
        <div className="py-10 text-sm text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
          {curators.slice(0, limit).map((curator, index) => (
            <Link
              key={curator.id}
              href="/curators"
              className="group block"
            >
              <GlitchBorder
                seed={index * 7 + 11}
                thickness={1}
                hoverBoost={14}
                delayMs={200}
                className="overflow-hidden"
              >
                <Image
                  src={curator.curator_image || homeImages.curatorsBox}
                  alt={curator.name}
                  width={600}
                  height={750}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </GlitchBorder>

              <p className="headline mt-3 text-sm leading-tight font-semibold transition-colors group-hover:text-accent md:text-lg">
                {curator.name}
              </p>

              {curator.description && (
                <p className="headline text-[11px] text-muted-foreground md:text-xs">
                  {curator.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <Link
          href="/curators"
          className="label transition-colors hover:text-accent"
        >
          All curators &nbsp;→
        </Link>
      </div>
    </section>
  );
}