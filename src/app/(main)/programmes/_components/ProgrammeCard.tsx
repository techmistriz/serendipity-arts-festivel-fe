"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import type { UIProgramme } from "@/types/programme";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { imagePaths } from "@/config/images";
import { useWishlist } from "@/hooks/use-wishlist";
import { isProgrammeNew } from "@/utils/date";
import { ScheduleMarquee } from "@/components/common/ScheduleMarquee";

type ProgrammeCardProps = {
  programme: UIProgramme;
  onAbout: () => void;
  onAdd: () => void;
};

const PLACEHOLDER_IMAGE = imagePaths.programmeFallback;
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=";

export function ProgrammeCard({ programme, onAbout, onAdd }: ProgrammeCardProps) {
  const { isSaved, toggleProgramme, loading: wishlistLoading, isAuthenticated } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Memoized values
  const isSavedProgramme = useMemo(() => isSaved(programme.id), [isSaved, programme.id]);

  const imageSrc = useMemo(
    () => (imageError ? PLACEHOLDER_IMAGE : programme.img || PLACEHOLDER_IMAGE),
    [imageError, programme.img],
  );

  //wishlist toolip hide in 3s
  useEffect(() => {
    if (!showLoginPrompt) return;

    const timer = setTimeout(() => {
      setShowLoginPrompt(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showLoginPrompt]);

  // Event handlers
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleWishlistToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        setShowLoginPrompt(true);
        return;
      }

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
    [isAuthenticated, isToggling, wishlistLoading, toggleProgramme, programme.id],
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

      {showLoginPrompt && (
        <div className="absolute top-12 right-2 z-30 bg-foreground text-background text-[10px] md:text-xs label px-3 py-2 rounded shadow-lg max-w-[180px] text-left">
          Register (if you haven&apos;t already) and log in to access this.
        </div>
      )}

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

            {isProgrammeNew(programme.createdAt) && (
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

          {/* Schedule Section */}
          <ScheduleMarquee slots={programme.slots} venue={programme.venue} className="mt-1 " />

          <div className="mt-2 flex flex-wrap gap-1.5">
            {programme.tags?.map((tag) => (
              <span
                key={tag.id}
                className="label max-w-full break-words px-1.5 py-0.5 text-[9px] leading-tight md:text-[10px]"
                style={{
                  background: tag.background_color,
                  color: tag.font_color,
                }}
              >
                {tag.name}
              </span>
            ))}
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
