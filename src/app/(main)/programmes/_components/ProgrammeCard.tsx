"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import type { UIProgramme } from "@/types/programme";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { imagePaths } from "@/config/images";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { categoryStyle, priceStyle, tagStyle } from "@/lib/tag-colors";

type ProgrammeCardProps = {
  programme: UIProgramme;
  onAbout: () => void;
  onAdd: () => void;
};

const PLACEHOLDER_IMAGE = imagePaths.programmeFallback;
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export function ProgrammeCard({ programme, onAbout, onAdd }: ProgrammeCardProps) {
  const { isVip } = useCart();
  const { isSaved, toggleProgramme, loading: wishlistLoading } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Memoized values
  const isSavedProgramme = useMemo(() => isSaved(programme.id), [isSaved, programme.id]);
  const priceLabel = useMemo(() => {
    if (isVip) return "Guest";
    return programme.price === 0 ? "Free" : `₹${programme.price || 0}`;
  }, [isVip, programme.price]);

  const imageSrc = useMemo(
    () => (imageError ? PLACEHOLDER_IMAGE : programme.img || PLACEHOLDER_IMAGE),
    [imageError, programme.img],
  );

  // Helper functions
  const formatTime = useCallback((time: string) => {
    if (!time) return "TBA";
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
  }, []);

  const getDateTimeLabel = useCallback(() => {
    if (!programme.slots?.length) return "Schedule TBA";
    const slot = programme.slots[0];
    return `${slot.day} Dec · ${formatTime(slot.time)}`;
  }, [programme.slots, formatTime]);

  // Event handlers
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isToggling || wishlistLoading) return;

      setIsToggling(true);
      try {
        await toggleProgramme(programme.id);
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
      } finally {
        setIsToggling(false);
      }
    },
    [isToggling, wishlistLoading, toggleProgramme, programme.id],
  );

  const handleAboutClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAbout();
    },
    [onAbout],
  );

  const handleAddClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAdd();
    },
    [onAdd],
  );

  // Validation
  if (!programme?.id) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[ProgrammeCard] Invalid programme data:", programme);
    }
    return null;
  }

  const isButtonDisabled = isToggling || wishlistLoading;

  return (
    <div className="group relative block text-left">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        disabled={isButtonDisabled}
        aria-label={isSavedProgramme ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-2 right-2 z-20 rounded-full bg-background/85 p-2 backdrop-blur-sm transition-colors hover:bg-background ${
          isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Heart
          className={`h-4 w-4 ${isSavedProgramme ? "fill-accent text-accent" : "text-foreground"}`}
          strokeWidth={1.75}
        />
      </button>

      {/* Main Programme Button */}
      <button onClick={onAbout} className="w-full text-left">
        <GlitchBorder
          seed={Number(programme.id) + 2}
          thickness={1}
          hoverBoost={14}
          delayMs={200}
          className="overflow-hidden"
        >
          <div className="relative aspect-square w-full bg-muted">
            <Image
              src={imageSrc}
              alt={programme.title || "Programme image"}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              onError={handleImageError}
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
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

        {/* Programme Info */}
        <div className="mt-3">
          <h3
            title={programme.title || "Untitled"}
            className="headline truncate text-sm leading-tight font-semibold tracking-[-0.01em] transition-colors group-hover:text-accent md:text-lg"
          >
            {programme.title || "Untitled"}
          </h3>

          <p className="headline mt-1 text-[11px] text-muted-foreground md:text-xs">
            {getDateTimeLabel()} · {programme.venue || "Venue TBA"}
          </p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span
              className="label max-w-full break-words px-1.5 py-0.5 text-[9px] leading-tight md:text-[10px]"
              style={categoryStyle(programme.category || "Uncategorized")}
            >
              {programme.category || "Uncategorized"}
            </span>
            {programme.tags?.length > 0 && (
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

      {/* Action Buttons */}
      <div className="mt-3 grid grid-cols-2 divide-x divide-foreground border border-foreground">
        <button
          onClick={handleAboutClick}
          className="headline px-3 py-2 text-[11px] tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background md:text-xs"
        >
          About
        </button>
        <button
          onClick={handleAddClick}
          disabled={!programme.isBookingAllowed}
          className="headline px-3 py-2 text-[11px] tracking-[0.06em] uppercase transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50 md:text-xs"
        >
          {programme.isBookingAllowed ? "Add to cart" : "Booking unavailable"}
        </button>
      </div>
    </div>
  );
}
