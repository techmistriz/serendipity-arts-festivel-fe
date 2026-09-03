import Image from "next/image";

import type { Sponsors } from "@/types/sponsor";

export function SponsorGrid({ sponsors }: { sponsors: Sponsors[] }) {
  return (
    <div className="mt-8 border">
      <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible">
        {sponsors.map((sponsor, i) => (
          <div
            key={sponsor.name}
            className={`flex w-[46vw] min-h-[140px] shrink-0 snap-start flex-col justify-between px-4 py-5 md:w-auto md:min-h-[180px] md:px-6 md:py-6 ${
              i !== sponsors.length - 1 ? "border-r" : ""
            }`}
          >
            <div className="grid flex-1 place-items-center">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={100}
                sizes="(max-width: 768px) 46vw, 25vw"
                className="h-auto max-h-[72px] w-auto max-w-full object-contain md:max-h-[92px]"
              />
            </div>

            <p className="headline mt-3 text-center text-[10px] leading-tight text-muted-foreground md:text-xs">
              {sponsor.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
