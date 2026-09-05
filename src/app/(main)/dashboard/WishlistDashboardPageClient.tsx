"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { fmtTime } from "@/data/programmes-data";
import { imagePaths } from "@/config/images";
import { ListRowsLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { useWishlist } from "@/hooks/use-wishlist";

import { DashboardShell } from "./DashboardShell";
import { ErrorMessage } from "./DashboardPageClient";

const FALLBACK_IMAGE = imagePaths.programmeFallback;

export function WishlistDashboardPageClient() {
  return (
    <DashboardShell>
      <WishlistContent />
    </DashboardShell>
  );
}

function WishlistContent() {
  const { error, loading, toggleProgramme, wishlistProgrammes } = useWishlist();

  const programmes = wishlistProgrammes.map((item) => {
    const programme = item.program;
    const firstSlot = programme?.program_details?.[0];

    return {
      id: item.programmeId,
      title: programme?.name || "Untitled",
      image: programme?.program_image || FALLBACK_IMAGE,
      category: programme?.category?.name || "Uncategorized",
      venue: firstSlot?.venue?.title || "Venue TBA",
      date: formatDate(firstSlot?.event_date),
      time: firstSlot?.from_time ? fmtTime(firstSlot.from_time) : "Time TBA",
      categoryColors: programme?.category
        ? {
            fontColor: programme.category.font_color,
            backgroundColor: programme.category.background_color,
          }
        : undefined,
    };
  });

  if (loading && programmes.length === 0) {
    return <ListRowsLoadingSkeleton label="Loading wishlist" />;
  }

  if (error && programmes.length === 0) {
    return <ErrorMessage message={error} />;
  }

  if (programmes.length === 0) {
    return (
      <p className="label py-16 text-center text-muted-foreground">
        Nothing saved yet. Browse{" "}
        <Link href="/programmes" className="text-foreground underline underline-offset-4">
          programmes
        </Link>{" "}
        and tap the heart to save.
      </p>
    );
  }

  return (
    <ul className="rule-t">
      {programmes.map((programme) => (
        <li key={programme.id} className="rule-b grid grid-cols-12 items-center gap-4 py-6">
          <div className="relative col-span-2 aspect-square w-full overflow-hidden rounded bg-muted md:col-span-1">
            <WishlistImage src={programme.image} alt={programme.title} />
          </div>
          <div className="col-span-7 md:col-span-8">
            <span
              className="label rounded px-1.5 py-0.5 text-[10px]"
              style={{
                color: programme.categoryColors?.fontColor || "#000",
                backgroundColor: programme.categoryColors?.backgroundColor || "#e5e5e5",
              }}
            >
              {programme.category}
            </span>
            <p className="headline mt-1 text-lg font-semibold leading-tight md:text-xl">
              {programme.title}
            </p>
            <p className="headline mt-1 text-xs text-muted-foreground">
              {programme.date} · {programme.time} · {programme.venue}
            </p>
          </div>
          <div className="col-span-3 flex flex-wrap items-center justify-end gap-2">
            <Link
              href={`/programmes?p=${programme.id}`}
              className="label border border-foreground px-3 py-2 text-xs transition-colors hover:bg-foreground hover:text-background"
            >
              Book →
            </Link>
            <button
              type="button"
              onClick={() => void toggleProgramme(programme.id)}
              disabled={loading}
              aria-label="Remove from wishlist"
              className={`p-2 transition-colors hover:text-accent ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <Heart className="h-4 w-4 fill-accent text-accent" strokeWidth={1.75} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WishlistImage({ alt, src }: { alt: string; src: string }) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageSrc = failedImage === src ? FALLBACK_IMAGE : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      className="object-cover"
      loading="lazy"
      sizes="(max-width: 768px) 20vw, 10vw"
      onError={() => setFailedImage(src)}
    />
  );
}

function formatDate(value?: string): string {
  if (!value) return "Date TBA";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
