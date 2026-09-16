"use client";

import { useEffect, useState } from "react";
import { Bell, Lock } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

import type { Programme } from "@/types/programme";
import { getProgrammes } from "@/services/programme.service";
import { GlitchBorder } from "@/components/common/GlitchBorder";
import { NotifyMeModal } from "./NotifyMeModal";
import { imagePaths, images } from "@/config/images";
import { useAuth } from "@/hooks/use-auth";
import { DROP_AT } from "@/lib/drop-data";
import { pad, useCountdown } from "@/utils/countdown";

const PLACEHOLDER_IMAGE = imagePaths.programmeFallback;

function Unit({ value, label, image }: { value: string; label: string; image: StaticImageData }) {
  return (
    <div className="relative isolate min-w-[64px] flex-1 overflow-hidden border-[3px] border-foreground px-2 py-3 text-center text-background md:py-4">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 768px) 120px, 25vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-foreground/55" />

      <div className="paper-grain absolute inset-0 -z-10 opacity-30 mix-blend-overlay" />

      <div className="display text-[11vw] leading-[0.85] tabular-nums md:text-[3.2rem]">
        {value}
      </div>

      <div className="label mt-2">{label}</div>
    </div>
  );
}

export function ProgrammeDrop() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);

  const { user, isAuthenticated } = useAuth();

  const t = useCountdown(DROP_AT);

  useEffect(() => {
    let cancelled = false;

    const loadDroppingProgrammes = async () => {
      try {
        setLoading(true);

        const data = await getProgrammes(undefined, undefined, {
          is_dropping_type: 1,
        });

        if (!cancelled) {
          setProgrammes(data);
        }
      } catch (error) {
        console.error("[ProgrammeDrop] Failed to fetch dropping programmes:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDroppingProgrammes();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderLoading = () => (
    <>
      <p className="sr-only" role="status">
        Loading programmes
      </p>

      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            {/* Image */}
            <div className="aspect-square w-full animate-pulse bg-muted" />

            {/* Content */}
            <div className="mt-3 space-y-2">
              <div className="h-5 w-3/4 animate-pulse bg-muted" />

              <div className="flex gap-2">
                <div className="h-4 w-14 animate-pulse bg-muted" />
                <div className="h-4 w-20 animate-pulse bg-muted" />
              </div>

              <div className="h-9 w-full animate-pulse bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </>
  );

  if (loading) {
    return renderLoading();
  }

  if (!programmes.length) {
    return null;
  }

  return (
    <section className="mt-20 md:mt-28">
      {/* Header */}
      <div className="rule-b flex flex-wrap items-end justify-between gap-4 pb-4">
        <div>
          <h2 className="display mt-3 text-[11vw] uppercase leading-[0.85] md:text-[4.5vw]">
            Dropping soon
          </h2>
        </div>

        <div className="flex w-full gap-2 md:w-auto md:min-w-[380px] md:gap-3">
          <Unit value={t ? pad(t.d) : "--"} label="Days" image={images.dropping_soon.daysImage} />

          <Unit value={t ? pad(t.h) : "--"} label="Hrs" image={images.dropping_soon.hoursImage} />

          <Unit value={t ? pad(t.m) : "--"} label="Min" image={images.dropping_soon.minutesImage} />

          <Unit value={t ? pad(t.s) : "--"} label="Sec" image={images.dropping_soon.secondsImage} />
        </div>
      </div>

      <p className="headline mt-5 max-w-2xl text-base md:text-lg">
        We will be releasing new exclusive programmes soon. Booking opens the moment they go live.
      </p>

      {/* Programme Grid */}
      <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-8 md:grid-cols-3 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
        {programmes.map((programme, index) => (
          <div key={programme.id} className="group relative block text-left">
            {/* Image */}
            <GlitchBorder
              seed={Number(programme.id) + index}
              thickness={1}
              hoverBoost={14}
              delayMs={200}
              className="overflow-hidden"
            >
              <div className="relative aspect-square w-full bg-foreground">
                <Image
                  src={programme.program_image || PLACEHOLDER_IMAGE}
                  alt={`${programme.name || "Programme"} programme preview`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="scale-[1.02] object-cover blur-lg transition-transform duration-700 group-hover:scale-[1.04]"
                />

                <div className="absolute inset-0 bg-foreground/10" />

                {/* Number */}
                <span className="label absolute left-2 top-2 bg-background px-2 py-1 text-foreground">
                  {index + 1}
                </span>

                {/* Locked */}
                <span className="label absolute right-2 top-2 flex items-center gap-1 bg-foreground px-2 py-1 text-background">
                  <Lock className="h-3 w-3" />
                  Locked
                </span>
              </div>
            </GlitchBorder>

            {/* Info */}
            <div className="mt-3">
              <h3 className="headline break-words text-sm font-semibold leading-tight transition-colors group-hover:text-accent md:text-lg">
                {programme.name}
              </h3>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {programme.program_tags?.slice(0, 1).map((tag) => (
                  <span
                    key={tag.id}
                    className="label px-1.5 py-0.5 text-[9px] md:text-[10px]"
                    style={{
                      background: tag.background_color,
                      color: tag.font_color,
                    }}
                  >
                    {tag.name}
                  </span>
                ))}

                <span className="label bg-foreground px-1.5 py-0.5 text-[9px] text-background md:text-[10px]">
                  Dropping soon
                </span>
              </div>

              {/* {programme.dropping_soon_date && (
                <p className="label mt-2 text-[10px] text-muted-foreground">
                  Drops {programme.dropping_soon_date}
                </p>
              )} */}
            </div>

            {/* Notify */}
            <button
              type="button"
              onClick={() => setSelectedProgramme(programme)}
              className="headline mt-3 flex w-full items-center justify-center gap-2 border border-foreground px-3 py-2 text-[11px] uppercase tracking-[0.06em] transition-colors hover:bg-foreground hover:text-background md:text-xs"
            >
              <Bell className="h-3.5 w-3.5" />
              Notify me
            </button>
          </div>
        ))}
      </div>

      {/* Notify Modal */}
      {selectedProgramme && (
        <NotifyMeModal
          key={selectedProgramme.id}
          programmeId={selectedProgramme.id}
          programmeName={selectedProgramme.name}
          isOpen={Boolean(selectedProgramme)}
          onClose={() => setSelectedProgramme(null)}
          user={
            isAuthenticated
              ? {
                  id: user?.id,
                  name: user?.name,
                  email: user?.email,
                }
              : null
          }
        />
      )}
    </section>
  );
}
