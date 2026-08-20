"use client";

import Link from "next/link";
import Image from "next/image";

import venuesBox from "@public/venues-box.png";

import { useVenues } from "@/hooks/useVenues";
import { GlitchBorder } from "../common/GlitchBorder";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

const TORN_CLIP =
  "polygon(1.5% 3%, 22% 0.6%, 47% 2.4%, 71% 0%, 92% 2.8%, 100% 12%, 98.4% 38%, 100% 63%, 97.6% 88%, 88% 100%, 63% 97.4%, 39% 100%, 15% 97.8%, 2.4% 92%, 0% 66%, 1.8% 41%, 0.4% 18%)";

const tornStyle = {
  clipPath: TORN_CLIP,
  WebkitClipPath: TORN_CLIP,
} as const;

export function VenuesSection() {
  const {
    venues,
    loading,
    error,
  } = useVenues({
    limit: 4,
    featuredOnly: true,
  });

  const [gameGate, setGameGate] = useState(false);

  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );

  return (
    <section className="container-editorial mt-20 md:mt-32">
      {/* HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start mb-10 md:mb-14">
        <h2 className="md:col-span-7 display uppercase text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
          Venues
        </h2>

        {/* SERENDIPITY DASH */}
        <button
          type="button"
          onClick={() => setGameGate(true)}
          className="paper-grain md:col-span-5 block w-full text-left relative px-7 py-8 md:px-9 md:py-10 overflow-hidden bg-cover"
          style={{
            backgroundImage: `url(${venuesBox.src})`,
            backgroundPosition: "22% 78%",
            backgroundSize: "150%",
            // ...tornStyle,
          }}
        >
          <div className="absolute inset-0 bg-foreground/55" aria-hidden />
          <div className="relative">
            <p className="notch font-semibold uppercase text-xl md:text-2xl leading-[1] tracking-[-0.01em] text-white">
              Serendipity Dash
            </p>

            <p className="headline text-xs md:text-sm mt-2 max-w-lg text-white/85">
              Run the festival streets that cross our festival venues over the years, dodge the vans and collect points. Our little game, playable in your browser.
            </p>
            <span className="mt-4 inline-block label notch border border-white text-white px-4 py-2.5 hover:bg-white hover:text-foreground transition-colors">
              Play the game →
            </span>
          </div>
        </button>

        {gameGate && (
          <div
            className="fixed inset-0 z-[120] bg-foreground/70 flex items-center justify-center p-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-md bg-background border-[3px] border-foreground p-7 md:p-9">
              <button
                type="button"
                onClick={() => setGameGate(false)}
                aria-label="Close"
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-foreground text-background notch text-lg leading-none"
              >
                ✕
              </button>

              <p className="notch uppercase text-2xl leading-[1]">
                Play Serendipity Dash
              </p>

              <p className="headline text-sm mt-3 text-muted-foreground">
                {isAuthenticated
                  ? "You are all set. Start the game."
                  : "You need to log in to play Serendipity Dash."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setGameGate(false);

                      // Open game here
                      // window.open("/serendipity-dash", "_blank");
                    }}
                    className="label notch bg-foreground text-background px-5 py-3"
                  >
                    Start playing
                  </button>
                ) : (
                  <>
                    <Link
                      href="/register?mode=general&next=/"
                      onClick={() => setGameGate(false)}
                      className="label notch bg-foreground text-background px-5 py-3"
                    >
                      Register
                    </Link>

                    <Link
                      href="/login"
                      onClick={() => setGameGate(false)}
                      className="label notch border-[3px] border-foreground px-5 py-3"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-full aspect-[4/5] bg-muted" />
              <div className="mt-3 h-5 bg-muted w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* ERROR */
        <p className="headline text-sm text-muted-foreground">
          {error}
        </p>
      ) : venues.length === 0 ? (
        /* EMPTY */
        <p className="headline text-sm text-muted-foreground">
          No venues available.
        </p>
      ) : (
        /* VENUES GRID */
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {venues.map((venue, i) => (
            <Link
              key={venue.id}
              href={`/venues`}
              className="group block"
            >
              <GlitchBorder
                seed={i + 17}
                thickness={1}
                hoverBoost={14}
                delayMs={200}
                className="overflow-hidden"
              >
                {venue.featured_image ? (
                  <Image
                    src={venue.featured_image}
                    alt={venue.title}
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 "
                  />
                ) : (
                  <div className="w-full aspect-[4/5] bg-muted grid place-items-center">
                    <span className="display text-4xl">
                      {venue.title.charAt(0)}
                    </span>
                  </div>
                )}
              </GlitchBorder>

              <p className="headline font-semibold text-sm md:text-lg mt-3 group-hover:text-accent transition-colors">
                {venue.title}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* ALL VENUES */}
      <div className="mt-10 flex justify-end">
        <Link
          href="/venues"
          className="label hover:text-accent transition-colors"
        >
          All venues &nbsp;→
        </Link>
      </div>
    </section>
  );
}