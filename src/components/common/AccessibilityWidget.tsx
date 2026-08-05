"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Accessibility, X } from "lucide-react";

type A11yState = {
  fontScale: number; // 1 = default
  contrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  grayscale: boolean;
  bigCursor: boolean;
  readableFont: boolean;
  screenReader: boolean;
  invert: boolean;
  highlightLinks: boolean;
  letterSpacing: boolean;
  lineHeight: boolean;
  hideImages: boolean;
  focusHighlight: boolean;
  leftAlign: boolean;
  dyslexia: boolean;
  readingGuide: boolean;
};


const DEFAULTS: A11yState = {
  fontScale: 1,
  contrast: false,
  underlineLinks: false,
  reduceMotion: false,
  grayscale: false,
  bigCursor: false,
  readableFont: false,
  screenReader: false,
  invert: false,
  highlightLinks: false,
  letterSpacing: false,
  lineHeight: false,
  hideImages: false,
  focusHighlight: false,
  leftAlign: false,
  dyslexia: false,
  readingGuide: false,
};

const KEY = "saf-a11y";

function apply(s: A11yState) {
  const el = document.documentElement;
  el.style.setProperty("--a11y-font-scale", String(s.fontScale));
  el.classList.toggle("a11y-contrast", s.contrast);
  el.classList.toggle("a11y-underline", s.underlineLinks);
  el.classList.toggle("a11y-reduce-motion", s.reduceMotion);
  el.classList.toggle("a11y-grayscale", s.grayscale);
  el.classList.toggle("a11y-big-cursor", s.bigCursor);
  el.classList.toggle("a11y-readable-font", s.readableFont);
  el.classList.toggle("a11y-invert", s.invert);
  el.classList.toggle("a11y-highlight-links", s.highlightLinks);
  el.classList.toggle("a11y-spacing", s.letterSpacing);
  el.classList.toggle("a11y-line-height", s.lineHeight);
  el.classList.toggle("a11y-hide-images", s.hideImages);
  el.classList.toggle("a11y-focus", s.focusHighlight);
  el.classList.toggle("a11y-left-align", s.leftAlign);
  el.classList.toggle("a11y-dyslexia", s.dyslexia);
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULTS);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const speakingRef = useRef<string>("");

  useEffect(() => {
    let el = document.getElementById("saf-a11y-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "saf-a11y-root";
      document.body.appendChild(el);
    }
    setHost(el);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = { ...DEFAULTS, ...JSON.parse(raw) } as A11yState;
        setState(parsed);
        apply(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Screen reader: speak the text of whatever the user hovers or focuses.
  useEffect(() => {
    if (!state.screenReader || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const speak = (text: string) => {
      const clean = text.replace(/\s+/g, " ").trim().slice(0, 300);
      if (!clean || clean === speakingRef.current) return;
      speakingRef.current = clean;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 1;
      window.speechSynthesis.speak(u);
    };

    const fromEvent = (target: EventTarget | null) => {
      const node = target as HTMLElement | null;
      if (!node || !node.closest) return;
      if (node.closest("#saf-a11y-root")) return;
      const el = node.closest(
        "a, button, h1, h2, h3, h4, p, li, label, summary, [role='button'], [aria-label], img"
      ) as HTMLElement | null;
      if (!el) return;
      const text = el.getAttribute("aria-label") || (el as HTMLImageElement).alt || el.innerText || "";
      speak(text);
    };

    const onOver = (e: Event) => fromEvent(e.target);
    const onFocus = (e: Event) => fromEvent(e.target);
    document.addEventListener("mouseover", onOver, true);
    document.addEventListener("focusin", onFocus, true);
    return () => {
      document.removeEventListener("mouseover", onOver, true);
      document.removeEventListener("focusin", onFocus, true);
      window.speechSynthesis.cancel();
      speakingRef.current = "";
    };
  }, [state.screenReader]);

  // Reading guide: a horizontal ruler that follows the pointer.
  useEffect(() => {
    if (!state.readingGuide) return;
    const bar = document.createElement("div");
    bar.id = "saf-a11y-reading-guide";
    bar.style.top = "50%";
    document.body.appendChild(bar);
    const move = (e: MouseEvent) => { bar.style.top = `${e.clientY - 22}px`; };
    document.addEventListener("mousemove", move);
    return () => {
      document.removeEventListener("mousemove", move);
      bar.remove();
    };
  }, [state.readingGuide]);

  const readPage = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const main = (document.querySelector("main") as HTMLElement) || document.body;
    const text = main.innerText.replace(/\s+/g, " ").trim().slice(0, 6000);
    if (!text) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const stopReading = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    speakingRef.current = "";
  };


  const update = (patch: Partial<A11yState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      apply(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const reset = () => {
    stopReading();
    apply(DEFAULTS);
    setState(DEFAULTS);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  const Toggle = ({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`headline text-xs uppercase tracking-[0.06em] border border-foreground px-3 py-3 text-left transition-colors ${
        on ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"
      }`}
    >
      {label}
    </button>
  );

  if (!host) return null;

  return createPortal(
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open accessibility options"
        aria-expanded={open}
        className="fixed bottom-4 left-4 z-[100] grid h-12 w-12 place-items-center rounded-full border border-foreground bg-background text-foreground shadow-sm hover:bg-foreground hover:text-background transition-colors"
      >
        <Accessibility className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Accessibility options"
          className="fixed bottom-20 left-4 z-[100] max-h-[75vh] overflow-y-auto w-[min(20rem,calc(100vw-2rem))] border border-foreground bg-background p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <h2 className="display uppercase text-xl leading-none">Accessibility</h2>
            <button onClick={() => setOpen(false)} aria-label="Close accessibility options">
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-4">
            <p className="label text-muted-foreground">Text size — {Math.round(state.fontScale * 100)}%</p>
            <div className="mt-2 grid grid-cols-3 border border-foreground divide-x divide-foreground">
              <button
                className="headline text-xs uppercase py-2 hover:bg-foreground hover:text-background transition-colors"
                onClick={() => update({ fontScale: Math.max(0.9, +(state.fontScale - 0.1).toFixed(2)) })}
                aria-label="Decrease text size"
              >
                A−
              </button>
              <button
                className="headline text-xs uppercase py-2 hover:bg-foreground hover:text-background transition-colors"
                onClick={() => update({ fontScale: 1 })}
              >
                Reset
              </button>
              <button
                className="headline text-xs uppercase py-2 hover:bg-foreground hover:text-background transition-colors"
                onClick={() => update({ fontScale: Math.min(1.6, +(state.fontScale + 0.1).toFixed(2)) })}
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Toggle label="High contrast" on={state.contrast} onClick={() => update({ contrast: !state.contrast })} />
            <Toggle label="Underline links" on={state.underlineLinks} onClick={() => update({ underlineLinks: !state.underlineLinks })} />
            <Toggle label="Reduce motion" on={state.reduceMotion} onClick={() => update({ reduceMotion: !state.reduceMotion })} />
            <Toggle label="Grayscale" on={state.grayscale} onClick={() => update({ grayscale: !state.grayscale })} />
            <Toggle label="Readable font" on={state.readableFont} onClick={() => update({ readableFont: !state.readableFont })} />
            <Toggle label="Big cursor" on={state.bigCursor} onClick={() => update({ bigCursor: !state.bigCursor })} />
            <Toggle label="Invert colours" on={state.invert} onClick={() => update({ invert: !state.invert })} />
            <Toggle label="Highlight links" on={state.highlightLinks} onClick={() => update({ highlightLinks: !state.highlightLinks })} />
            <Toggle label="Letter spacing" on={state.letterSpacing} onClick={() => update({ letterSpacing: !state.letterSpacing })} />
            <Toggle label="Line height" on={state.lineHeight} onClick={() => update({ lineHeight: !state.lineHeight })} />
            <Toggle label="Hide images" on={state.hideImages} onClick={() => update({ hideImages: !state.hideImages })} />
            <Toggle label="Focus outline" on={state.focusHighlight} onClick={() => update({ focusHighlight: !state.focusHighlight })} />
            <Toggle label="Align left" on={state.leftAlign} onClick={() => update({ leftAlign: !state.leftAlign })} />
            <Toggle label="Dyslexia font" on={state.dyslexia} onClick={() => update({ dyslexia: !state.dyslexia })} />
            <Toggle label="Reading guide" on={state.readingGuide} onClick={() => update({ readingGuide: !state.readingGuide })} />
            <Toggle
              label="Screen reader"
              on={state.screenReader}
              onClick={() => {
                if (state.screenReader) stopReading();
                update({ screenReader: !state.screenReader });
              }}
            />
            <button
              onClick={readPage}
              className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-3 py-3 text-left hover:bg-foreground hover:text-background transition-colors"
            >
              Read page
            </button>
          </div>

          {state.screenReader && (
            <button
              onClick={stopReading}
              className="mt-2 w-full headline text-xs uppercase tracking-[0.06em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
            >
              Stop speaking
            </button>
          )}

          <button
            onClick={reset}
            className="mt-4 w-full headline text-xs uppercase tracking-[0.06em] bg-foreground text-background px-4 py-3 hover:bg-accent transition-colors"
          >
            Reset all
          </button>
        </div>
      )}
    </>,
    host
  );
}

