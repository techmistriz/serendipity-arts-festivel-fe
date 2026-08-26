"use client";

import Image from "next/image";
import Link from "next/link";

import { LogoGridLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { useSponsors } from "@/hooks/useSponsors";

export function SponsorsSection() {
  const { sponsors, loading, error } = useSponsors(8);

  return (
    <section className="container-editorial mt-20 md:mt-32">
      <h2 className="display mb-8 text-4xl leading-[0.9] uppercase sm:text-5xl md:mb-12 md:text-7xl lg:text-8xl">
        Supported by
      </h2>

      {loading ? (
        <LogoGridLoadingSkeleton label="Loading partners" />
      ) : error ? (
        <p role="alert" className="headline py-10 text-sm text-muted-foreground">
          Partners are currently unavailable. Please try again later.
        </p>
      ) : sponsors.length > 0 ? (
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex w-[46vw] shrink-0 snap-start flex-col border border-foreground px-2 py-2 md:w-auto"
            >
              <div className="grid h-[86px] flex-1 place-items-center md:h-[104px]">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={200}
                  height={100}
                  sizes="(max-width: 768px) 46vw, 25vw"
                  className="h-auto max-h-[82px] w-auto max-w-full object-contain md:max-h-[100px]"
                />
              </div>
              <p className="headline mt-1.5 text-[10px] leading-tight text-muted-foreground">
                {sponsor.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="headline py-10 text-sm text-muted-foreground">
          Partner information is coming soon.
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <Link href="/partners" className="label transition-colors hover:text-accent">
          All partners &nbsp;&rarr;
        </Link>
      </div>
    </section>
  );
}
