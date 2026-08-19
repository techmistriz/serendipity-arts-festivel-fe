import Image from "next/image";

import { GlitchLines } from "@/components/common/GlitchLines";
import whiteLogo from "@public/images/home/saf-logo-white-2026.png";

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
        className="pointer-events-none absolute inset-0 h-full w-full opacity-85 md:hidden"
      />
      <GlitchLines
        seed={23}
        columns={70}
        density={0.22}
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-85 md:block"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="container-editorial absolute inset-0 flex flex-col justify-between py-6 md:py-10">
        <div className="flex items-start justify-between gap-4">
          <Image
            src={whiteLogo}
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
