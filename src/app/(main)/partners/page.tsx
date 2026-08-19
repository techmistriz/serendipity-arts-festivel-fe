"use client";

import GlitchBar from "@/components/common/GlitchBar";
import Loader from "@/components/common/Loader";
import { useSponsors } from "@/hooks/useSponsors";
import { FESTIVAL_LOGO, FOUNDATION_LOGO } from "@/data/partners";
import Image from "next/image";

export default function Partners() {
  const { sponsors, loading, error } = useSponsors(8);

  // if (error) {
  //   return <ErrorMessage2 message={error} />;
  // }

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32 relative">
      <GlitchBar
        seed={17}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={70}
        className="hidden md:block absolute left-0 top-20 bottom-32 w-1"
      />
      <h1 className="display uppercase text-[13vw] md:text-[9vw] leading-[0.9]">Partners</h1>

      <h2 className="mt-14 md:mt-20 display uppercase text-2xl md:text-4xl leading-[1] rule-b pb-4">
        Supported by
      </h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="mt-8 -mx-5 px-5 md:mx-0 md:px-0 flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
          {sponsors.map((p) => (
            <div
              key={p.name}
              className="shrink-0 w-[46vw] snap-start md:w-auto border border-foreground px-2 py-2 flex flex-col"
            >
              <div className="grid place-items-center flex-1 h-[86px] md:h-[104px]">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={200}
                  height={100}
                  loading="lazy"
                  className="max-h-[82px] md:max-h-[100px] max-w-full w-auto object-contain"
                />
              </div>
              <p className="mt-1.5 headline text-[10px] leading-tight text-muted-foreground">
                {p.name}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-16 md:mt-24 display uppercase text-2xl md:text-4xl leading-[1] rule-b pb-4">
        Presented by
      </h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="border border-foreground p-6 grid place-items-center min-h-[180px]">
          <Image
            src={FESTIVAL_LOGO}
            alt="Serendipity Arts Festival"
            loading="lazy"
            className="max-h-28 w-auto object-contain"
          />
        </div>
        <div className="border border-foreground p-6 grid place-items-center min-h-[180px]">
          <Image
            src={FOUNDATION_LOGO}
            alt="Serendipity Arts — Munjal Initiative for Creativity"
            loading="lazy"
            className="max-h-20 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
