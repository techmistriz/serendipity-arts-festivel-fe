// "Let us help you" — a light-hearted modal that asks the visitor a couple of
// questions and surfaces programmes matching their taste.
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { RECOMMENDER_OPTIONS, recommendProgrammes } from "@/lib/recommender";
import { dateLabel, timeLabel } from "@/lib/programmes-data";
import { GlitchBar } from "./GlitchBar";

export function RecommendModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [picks, setPicks] = useState<string[]>([]);
  const [shown, setShown] = useState(false);
  if (!open) return null;
  const recs = shown ? recommendProgrammes(picks, 8) : [];
  const toggle = (id: string) =>
    setPicks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 md:p-8">
      <div className="absolute inset-0 bg-foreground/70" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-background border border-foreground">
        <GlitchBar seed={31} direction="h" speed={2.4} count={160} className="h-3 w-full" />
        <div className="p-5 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="display uppercase text-2xl md:text-4xl leading-[0.95]">
              Let us help you — recommend programmes
            </h2>
            <button onClick={onClose} aria-label="Close" className="label border border-foreground px-3 py-1.5">
              ✕
            </button>
          </div>

          {!shown ? (
            <div className="mt-6 space-y-6">
              <div>
                <p className="label">Pick anything that sounds like you.</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {RECOMMENDER_OPTIONS.map((o) => {
                    const on = picks.includes(o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => toggle(o.id)}
                        aria-pressed={on}
                        className={`text-left p-3 border border-foreground transition-colors ${
                          on ? "bg-foreground text-background" : "hover:bg-muted"
                        }`}
                      >
                        <span className="headline text-sm leading-snug">{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={() => setShown(true)}
                disabled={!picks.length}
                className="headline font-semibold uppercase text-base bg-foreground text-background px-6 py-3 disabled:opacity-40"
              >
                Show my picks →
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="headline font-semibold uppercase text-xl md:text-2xl">
                  {recs.length ? `Here's what we'd pick for you.` : "No matches yet — check back soon."}
                </p>
                <button onClick={() => setShown(false)} className="label border border-foreground px-3 py-1.5">
                  Change answers ↺
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {recs.map((p) => (
                  <Link key={p.id} to="/programmes" search={{ p: p.id } as never} onClick={onClose} className="group block">
                    <img src={p.img} alt={p.title} loading="lazy"
                      className="w-full aspect-square object-cover border border-foreground" />
                    <h3 className="mt-2 headline font-semibold text-sm leading-tight">{p.title}</h3>
                    <p className="text-[11px] text-muted-foreground headline">{dateLabel(p)} · {timeLabel(p)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
