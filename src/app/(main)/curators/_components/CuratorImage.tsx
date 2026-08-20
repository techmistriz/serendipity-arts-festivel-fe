import Image from "next/image";

import { resolveApiMediaUrl } from "@/utils/media";

type CuratorImageProps = {
  image: string | null;
  alt: string;
};

export function CuratorImage({ image, alt }: CuratorImageProps) {
  const src = resolveApiMediaUrl(image);

  if (!src) {
    return (
      <div className="flex aspect-[4/5] w-full items-end bg-muted p-4 text-xs tracking-[0.08em] text-muted-foreground uppercase">
        Image unavailable
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={1000}
      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
      className="aspect-[4/5] w-full object-cover"
    />
  );
}
