import Image from "next/image";

import type { Vibe } from "@/types/vibe";

interface VibeCardProps {
  vibe: Vibe;
}

export default function VibeCard({ vibe }: VibeCardProps) {
  console.log("Vibes", vibe);
  return (
    <article className="flex flex-col border border-foreground bg-background">
      {vibe.featured_image && (
        <div className="relative aspect-[4/3] w-full border-b border-foreground">
          <Image
            src={vibe.featured_image}
            alt={vibe.title}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="label text-muted-foreground">{vibe.partner_type?.name}</p>

        <h2 className="display text-2xl uppercase leading-[1]">{vibe.title}</h2>

        <p className="headline text-sm">{vibe.short_description}</p>

        {vibe.location && (
          <a
            href={vibe.location}
            target="_blank"
            rel="noreferrer"
            className="label notch mt-auto self-start bg-foreground px-4 py-2 text-background hover:bg-accent"
          >
            View location →
          </a>
        )}
      </div>
    </article>
  );
}
