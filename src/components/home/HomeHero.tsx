import Image from "next/image";

import { GlitchLines } from "@/components/common/GlitchLines";
import { homeImages } from "@/config/images";

import { HomeRegisterLink } from "./HomeRegisterLink";

export function HomeHero() {
  return (
    <section className="relative h-[72vh] min-h-[480px] w-full overflow-hidden bg-black text-white">
      <video
        src="/saf-aftermovie.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <GlitchLines
          seed={23}
          columns={28}
          density={0.22}
          parallax
          strength={4}
          className="absolute -inset-[6%] h-[112%] w-[112%] opacity-85 pointer-events-none md:hidden"
        />
     <GlitchLines
          seed={23}
          columns={70}
          density={0.22}
          parallax
          strength={3.5}
          className="absolute -inset-[6%] h-[112%] w-[112%] opacity-85 pointer-events-none hidden md:block"
        />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="container-editorial absolute inset-0 flex flex-col justify-between py-6 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <Image
            src={homeImages.whiteLogo}
            alt="Serendipity Arts Festival 2026"
            sizes="(max-width: 768px) 42vw, 26vw"
            className="-mt-4 h-auto w-[42vw] max-w-[240px] brightness-0 invert md:-mt-6 md:w-[26vw] md:max-w-[400px]"
          />
          <HomeRegisterLink />
        </div>

        <div className="flex justify-end">
          <p className="display text-right text-[6vw] leading-[1.05] tracking-[-0.02em] whitespace-nowrap uppercase md:max-w-[46vw] md:text-[3.1vw]">
            Panjim, Goa
            <br />
            13–20 December
          </p>
        </div>
      </div>
    </section>
  );
}
