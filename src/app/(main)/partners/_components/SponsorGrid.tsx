import Image from "next/image";

import type { Sponsors } from "@/types/sponsor";

export function SponsorGrid({ sponsors }: { sponsors: Sponsors[] }) {
  return (
    <div className="mt-8">
      {" "}
      {/* ← yahan se border hata diya */}
      {/* Desktop */}
      <div className="relative hidden md:block">
        <div className="flex flex-wrap">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="
                flex w-1/4 min-h-[180px] flex-col justify-between
                border border-foreground px-6 py-6
                -ml-px -mt-px
              "
            >
              <div className="grid flex-1 place-items-center">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={200}
                  height={100}
                  sizes="25vw"
                  className="h-auto max-h-[92px] w-auto max-w-full object-contain"
                />
              </div>

              <p className="headline mt-3 text-center text-xs leading-tight text-muted-foreground">
                {sponsor.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile (same fix) */}
      <div className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="
              flex w-[46vw] min-h-[140px] shrink-0 snap-start
              flex-col justify-between
              border border-foreground px-4 py-5
              -ml-px
            "
          >
            <div className="grid flex-1 place-items-center">
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={200}
                height={100}
                sizes="46vw"
                className="h-auto max-h-[72px] w-auto max-w-full object-contain"
              />
            </div>

            <p className="headline mt-3 text-center text-[10px] leading-tight text-muted-foreground">
              {sponsor.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
