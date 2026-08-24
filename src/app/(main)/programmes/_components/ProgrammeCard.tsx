"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

import type { Programme } from "@/data/programmes-data";
// import { dateLabel, timeLabel } from "@/data/programmes-data";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { categoryStyle, priceStyle, tagStyle } from "@/lib/tag-colors";

type ProgrammeCardProps = {
  programme: Programme;
  onAbout: () => void;
  onAdd: () => void;
};

export function ProgrammeCard({ programme, onAbout, onAdd }: ProgrammeCardProps) {
  const { isVip } = useCart();
  const { programmeIds, toggleProgramme } = useWishlist();
  const isSaved = programmeIds.includes(programme.id);
  const priceLabel = isVip ? "Guest" : programme.price === 0 ? "Free" : `₹${programme.price}`;

  return (
    <div className="group relative block text-left">
      <button
        onClick={(event) => {
          event.stopPropagation();
          toggleProgramme(programme.id);
        }}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-2 right-2 z-20 rounded-full bg-background/85 p-2 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Heart
          className={`h-4 w-4 ${isSaved ? "fill-accent text-accent" : "text-foreground"}`}
          strokeWidth={1.75}
        />
      </button>
      <button onClick={onAbout} className="w-full text-left">
        <GlitchBorder
          seed={Number(programme.id) + 2}
          thickness={1}
          hoverBoost={14}
          delayMs={200}
          className="overflow-hidden"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={programme.img}
              alt={programme.title}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />

            {programme.newlyAdded && (
              <span
                className="label absolute top-2 left-2 px-2 py-1"
                style={{ background: "#CEDC29", color: "#0A0A0A" }}
              >
                New
              </span>
            )}
          </div>
        </GlitchBorder>
        <div className="mt-3">
          <h3 className="headline break-words text-sm leading-tight font-semibold tracking-[-0.01em] hyphens-auto transition-colors group-hover:text-accent md:text-lg">
            {programme.title}
          </h3>
          {/* <p className="headline mt-1 text-[11px] text-muted-foreground md:text-xs">
            {dateLabel(programme)} · {timeLabel(programme)} · {programme.venue}
          </p> */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="label max-w-full break-words px-1.5 py-0.5 text-[9px] leading-tight md:text-[10px]"
              style={categoryStyle(programme.category)}
            >
              {programme.category}
            </span>
            {programme.tags[0] && (
              <span
                className="label max-w-full break-words px-1.5 py-0.5 text-[9px] leading-tight md:text-[10px]"
                style={tagStyle(programme.tags[0])}
              >
                {programme.tags[0]}
              </span>
            )}
            <span
              className="label px-1.5 py-0.5 text-[9px] leading-tight md:text-[10px]"
              style={priceStyle(priceLabel)}
            >
              {priceLabel}
            </span>
          </div>
        </div>
      </button>
      <div className="mt-3 grid grid-cols-2 divide-x divide-foreground border border-foreground">
        <button
          onClick={onAbout}
          className="headline px-3 py-2 text-[11px] tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background md:text-xs"
        >
          About
        </button>
        <button
          onClick={onAdd}
          className="headline px-3 py-2 text-[11px] tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background md:text-xs"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
