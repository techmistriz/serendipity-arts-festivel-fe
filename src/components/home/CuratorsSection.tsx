import Image from "next/image";
import Link from "next/link";

import { GlitchBorder } from "@/components/common/GlitchBorder";
import { CURATORS } from "@/data/curators";
import curatorsBox from "@public/curators-box.jpg";

import { HomePromoPanel } from "./HomePromoPanel";
import { HomeSectionHeader } from "./HomeSectionHeader";

const featuredCurators = [...CURATORS].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 4);

export function CuratorsSection() {
  return (
    <section className="container-editorial mt-20 md:mt-32">
      <HomeSectionHeader title="Curators">
        <a
          href="https://serendipityarts.org/curator-overview/"
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-5"
        >
          <HomePromoPanel image={curatorsBox}>
            <p className="notch text-xl leading-[1] font-semibold tracking-[-0.01em] text-white uppercase md:text-2xl">
              Meet the festival curators over the years
            </p>
            <span className="label notch mt-4 inline-block border border-white px-4 py-2.5 text-white transition-colors hover:bg-white hover:text-foreground">
              Curator overview →
            </span>
          </HomePromoPanel>
        </a>
      </HomeSectionHeader>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {featuredCurators.map((curator, index) => (
          <Link key={curator.name} href="/curators" className="group block">
            <GlitchBorder
              seed={index * 7 + 11}
              thickness={1}
              hoverBoost={14}
              delayMs={200}
              className="overflow-hidden"
            >
              <Image
                src={curator.img}
                alt={curator.name}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </GlitchBorder>
            <p className="headline mt-3 text-sm leading-tight font-semibold transition-colors group-hover:text-accent md:text-lg">
              {curator.name}
            </p>
            <p className="headline text-[11px] text-muted-foreground md:text-xs">
              {curator.discipline}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <Link href="/curators" className="label transition-colors hover:text-accent">
          All curators &nbsp;→
        </Link>
      </div>
    </section>
  );
}
