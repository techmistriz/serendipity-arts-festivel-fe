import Image from "next/image";

import type { Sponsors } from "@/types/sponsor";

export function SponsorGrid({ sponsors }: { sponsors: Sponsors[] }) {
  return (
    <div className="mt-8 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
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
  );
}
