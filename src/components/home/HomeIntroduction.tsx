import Image from "next/image";

import { tornPaperStyle } from "@/config/constants";
import { homeImages } from "@/config/images";

export function HomeIntroduction() {
  return (
    <section className="container-editorial mt-20 md:mt-32">
      <div
        className="relative min-h-[320px] w-full overflow-hidden md:min-h-[420px] lg:min-h-[520px]"
        style={tornPaperStyle}
      >
        <Image
          src={homeImages.collageHero}
          alt="Serendipity Arts Festival collage"
          fill
          sizes="(max-width: 768px) 100vw, min(100vw - 80px, 1600px)"
          className="object-cover md:origin-top-left md:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-black/40" aria-hidden />
        <div className="relative flex min-h-[320px] items-center justify-center px-6 py-14 text-center md:min-h-[420px] md:px-10 md:py-20 lg:min-h-[520px]">
          <p className="display max-w-[18ch] text-[8vw] leading-[0.95] tracking-[-0.02em] text-white uppercase md:text-[4vw]">
            8 days of exhibitions, performances, workshops and more never seen before.
          </p>
        </div>
      </div>
    </section>
  );
}
