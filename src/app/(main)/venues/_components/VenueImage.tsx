import Image from "next/image";

import { resolveApiMediaUrl } from "@/utils/media";

type VenueImageProps = {
  image: string | null;
  alt: string;
};

export function VenueImage({ image, alt }: VenueImageProps) {
  const src = resolveApiMediaUrl(image);

  if (!src) {
    return (
      <div className="flex aspect-[4/3] w-full items-end bg-muted p-4 text-xs tracking-[0.08em] text-muted-foreground uppercase">
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(min-width: 768px) 50vw, 100vw"
      className="aspect-[4/3] h-full w-full object-cover"
    />
  );
}
