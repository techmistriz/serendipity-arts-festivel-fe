import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import Image from "next/image";

type HomePromoPanelProps = {
  image: StaticImageData;
  imageClassName?: string;
  children: ReactNode;
};

export function HomePromoPanel({ image, imageClassName = "", children }: HomePromoPanelProps) {
  return (
    <div
      className="relative block overflow-hidden px-7 py-8 md:col-span-5 md:px-9 md:py-10"
      // style={tornPaperStyle}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 42vw"
        className={`object-cover ${imageClassName}`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-foreground/55" aria-hidden />
      <div className="relative">{children}</div>
    </div>
  );
}
