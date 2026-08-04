import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { RECOMMENDER_OPTIONS, recommendProgrammes } from "@/lib/recommender";
import { dateLabel, timeLabel } from "@/lib/programmes-data";
import { GlitchBorder } from "@/components/site/GlitchBorder";

export const Route = createFileRoute("/recommend")({
  head: () => ({
    meta: [
      { title: "Recommend programmes for me — Serendipity Arts Festival 2026" },
      { name: "description", content: "Tell us what you love and we'll surface programmes at the 11th Serendipity Arts Festival that match." },
      { property: "og:title", content: "Recommend programmes for me — Serendipity Arts Festival 2026" },
      { property: "og:description", content: "A quick way to find programmes that match your taste at SAF 2026." },
    ],
  }),
  component: Recommend,
});

function Recommend() {
  const [name, setName] = useState("");
  const [picks, setPicks] = useState<string[]>([]);
  const [shown, setShown] = useState(false);
  const recs = shown ? recommendProgrammes(picks, 12) : [];

  const toggle = (id: string) =>
    setPicks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <p className="label text-muted-foreground">Let us help you</p>
      <h1 className="display uppercase text-[12vw] md:text-[8vw] leading-[0.9] mt-3">
        Recommend programmes for me
      </h1>
      <p className="mt-6 max-w-2xl headline text-lg md:text-xl text-muted-foreground">
        Two quick questions and we'll surface programmes we think you'll love. New matches appear automatically as we keep adding programmes.
      </p>

      {!shown ? (
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-8">
            <div>
              <p className="label text-muted-foreground">1. How would you describe yourself?</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. writer, curious visitor, parent…"
                className="input mt-3"
              />
            </div>
          </div>

          <div className="md:col-span-7">
            <p className="label text-muted-foreground">2. Pick anything that sounds like you.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RECOMMENDER_OPTIONS.map((o) => {
                const on = picks.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggle(o.id)}
                    aria-pressed={on}
                    className={`text-left p-4 md:p-5 border transition-colors ${
                      on
                        ? "bg-foreground text-background border-foreground"
                        : "border-foreground/40 hover:border-foreground"
                    }`}
                  >
                    <p className="headline text-sm md:text-base leading-snug">{o.label}</p>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShown(true)}
              disabled={picks.length === 0}
              className="mt-8 headline font-semibold uppercase text-base md:text-lg bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:opacity-40"
            >
              Show my picks →
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display uppercase text-3xl md:text-5xl leading-[0.9]">
              {recs.length ? "Here's what we'd pick for you." : "No matches yet — check back soon."}
            </h2>
            <button
              onClick={() => setShown(false)}
              className="label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Change my answers ↺
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
            {recs.map((p) => (
              <Link key={p.id} to="/programmes" search={{ p: p.id } as never} className="group block">
                <GlitchBorder seed={p.id.length + 7} thickness={1} hoverBoost={10} className="overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy"
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </GlitchBorder>
                <div className="mt-3">
                  <p className="label text-muted-foreground">{p.category}</p>
                  <h3 className="mt-1 headline font-semibold text-sm md:text-lg leading-tight group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-1 text-[11px] md:text-xs text-muted-foreground headline">{dateLabel(p)} · {timeLabel(p)} · {p.venue}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
