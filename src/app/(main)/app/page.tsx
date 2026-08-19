"use client";

import { useEffect, useState } from "react";
import whiteLogo from "@public/images/home/saf-logo-white-2026.png";
import blackLogo from "@public/images/home/saf-logo-2026.png";
import { categoryStyle } from "@/lib/tag-colors";
import GlitchBar from "@/components/common/GlitchBar";
import { GlitchLines } from "@/components/common/GlitchLines";
import { dateLabel, Programme, PROGRAMMES, timeLabel } from "@/data/programmes-data";
import Image from "next/image";

type Screen =
  | "splash"
  | "login"
  | "welcome"
  | "home"
  | "programmes"
  | "detail"
  | "booking"
  | "success"
  | "festival";

const SCREEN_LABELS: { id: Screen; label: string }[] = [
  { id: "splash", label: "Splash" },
  { id: "login", label: "Login" },
  { id: "welcome", label: "Welcome" },
  { id: "home", label: "Home" },
  { id: "programmes", label: "Programmes" },
  { id: "detail", label: "Programme" },
  { id: "booking", label: "Booking" },
  { id: "success", label: "Success" },
  { id: "festival", label: "Festival" },
];

export default function AppPage() {
  return <AppSkin />;
}

function AppSkin() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [prog, setProg] = useState<Programme>(PROGRAMMES[0]);

  useEffect(() => {
    if (screen !== "splash") return;
    const t = setTimeout(() => setScreen("login"), 2000);
    return () => clearTimeout(t);
  }, [screen]);

  return (
    <div className="container-editorial pt-10 pb-24">
      <h1 className="display uppercase text-4xl md:text-7xl leading-[0.9]">App</h1>
      <p className="mt-3 headline text-sm md:text-base text-muted-foreground max-w-xl">
        The same app structure, skinned in the 2026 identity. Tap through the phone, or jump to any
        screen.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {SCREEN_LABELS.map((s) => (
          <button
            key={s.id}
            onClick={() => setScreen(s.id)}
            className={`label notch border border-foreground px-3 py-1.5 transition-colors ${
              screen === s.id ? "bg-foreground text-background" : "hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Phone>
          {screen === "splash" && <Splash />}
          {screen === "login" && <Login onNext={() => setScreen("welcome")} />}
          {screen === "welcome" && <Welcome onStart={() => setScreen("home")} />}
          {screen === "home" && (
            <Home
              onAll={() => setScreen("programmes")}
              onOpen={(p) => {
                setProg(p);
                setScreen("detail");
              }}
              onTab={setScreen}
            />
          )}
          {screen === "programmes" && (
            <Programmes
              onOpen={(p) => {
                setProg(p);
                setScreen("detail");
              }}
              onTab={setScreen}
            />
          )}
          {screen === "detail" && (
            <Detail
              p={prog}
              onBack={() => setScreen("programmes")}
              onBook={() => setScreen("booking")}
            />
          )}
          {screen === "booking" && (
            <Booking
              p={prog}
              onClose={() => setScreen("detail")}
              onBook={() => setScreen("success")}
            />
          )}
          {screen === "success" && <Success onCart={() => setScreen("home")} />}
          {screen === "festival" && <Festival onTab={setScreen} />}
        </Phone>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[390px] border border-foreground bg-background">
      <div className="relative h-[760px] overflow-hidden">{children}</div>
    </div>
  );
}

function Scroll({ children }: { children: React.ReactNode }) {
  return <div className="h-full overflow-y-auto pb-20">{children}</div>;
}

function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="sticky top-0 z-20 bg-background flex items-center gap-3 px-4 py-3 border-b border-foreground">
      {onBack && (
        <button onClick={onBack} className="label" aria-label="Back">
          ←
        </button>
      )}
      <p className="display uppercase text-xl leading-none">{title}</p>
    </div>
  );
}

function TabBar({ active, onTab }: { active: Screen; onTab: (s: Screen) => void }) {
  const tabs: { id: Screen; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "programmes", label: "Programmes" },
    { id: "festival", label: "Festival" },
    { id: "login", label: "Profile" },
  ];
  return (
    <div className="absolute bottom-0 inset-x-0 grid grid-cols-4 border-t border-foreground bg-foreground text-background">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onTab(t.id)}
          className={`label notch py-3 ${active === t.id ? "bg-background text-foreground" : ""}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- screens ---------- */

function Splash() {
  return (
    <div className="relative h-full bg-foreground overflow-hidden">
      <video
        src="/saf-aftermovie.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <GlitchLines
        seed={5}
        columns={22}
        density={0.24}
        className="absolute inset-0 h-full w-full opacity-85 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <Image
          src={whiteLogo}
          alt="Serendipity Arts Festival 2026"
          className="w-[62%] brightness-0 invert"
        />
        <p className="display uppercase text-white text-right text-3xl leading-[1.05]">
          Panjim, Goa
          <br />
          13–20 December
        </p>
      </div>
    </div>
  );
}

function Login({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative h-full bg-background">
      <div className="relative h-full flex flex-col justify-between p-6">
        <Image src={blackLogo} alt="Serendipity Arts Festival 2026" className="w-[60%]" />
        <div className="border border-foreground bg-background p-5">
          <p className="display uppercase text-2xl leading-none">Enter your detail</p>
          <input
            type="email"
            placeholder="Email address"
            className="mt-4 w-full border-b border-foreground bg-transparent py-2 headline text-base outline-none"
          />
          <button
            onClick={onNext}
            className="mt-5 w-full headline uppercase tracking-[0.06em] text-sm bg-foreground text-background py-3"
          >
            Next →
          </button>
          <p className="mt-3 label text-muted-foreground">
            Not registered yet? <span className="text-foreground underline">Register</span>
          </p>
        </div>
        <div />
      </div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative h-full">
      <Image
        src={PROGRAMMES[1].img}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <GlitchLines
        seed={29}
        columns={20}
        density={0.28}
        className="absolute inset-0 h-full w-full opacity-80 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden />
      <div className="relative h-full grid place-items-center p-6">
        <div className="w-full border border-foreground bg-background p-6">
          <p className="display uppercase text-4xl leading-[0.9]">
            Welcome to
            <br />
            SAF 2026
          </p>
          <p className="mt-4 headline text-sm leading-snug text-muted-foreground">
            Browse programmes across music, dance, theatre, food and more. Book your favourites,
            plan your festival and make the most of Goa.
          </p>
          <button
            onClick={onStart}
            className="mt-6 w-full headline uppercase tracking-[0.06em] text-sm bg-foreground text-background py-3"
          >
            Start exploring →
          </button>
        </div>
      </div>
    </div>
  );
}

function Home({
  onAll,
  onOpen,
  onTab,
}: {
  onAll: () => void;
  onOpen: (p: Programme) => void;
  onTab: (s: Screen) => void;
}) {
  const highlights = ["Exhibition", "Performance", "Workshop"] as const;
  return (
    <>
      <Scroll>
        <div className="px-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <Image src={blackLogo} alt="Serendipity Arts Festival 2026" className="w-[52%]" />
            <div className="flex gap-2">
              {["Bag", "Bell", "Find"].map((x) => (
                <span key={x} className="label border border-foreground px-2 py-1">
                  {x}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-3 label text-muted-foreground">13–20 December, 2026</p>

          <div className="mt-4 flex items-end justify-between gap-3 rule-b pb-4">
            <div>
              <p className="display uppercase text-3xl leading-[0.9]">Hello Apoorv,</p>
              <p className="headline text-sm mt-1">
                See you in <span className="text-accent">3 days</span>
              </p>
            </div>
            <button className="label notch bg-foreground text-background px-3 py-2">
              Art Pass
            </button>
          </div>
        </div>

        <div className="mt-5 px-4">
          <div className="relative border border-foreground overflow-hidden">
            <Image
              src={PROGRAMMES[1].img}
              alt="Festival banner"
              className="w-full aspect-[16/10] object-cover"
            />
            <GlitchLines
              seed={7}
              columns={18}
              density={0.3}
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>

        <div className="mt-8 px-4">
          <p className="display uppercase text-2xl leading-none">Highlights</p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            {highlights.map((h) => {
              const p = PROGRAMMES.find((x) => x.category === h) ?? PROGRAMMES[0];
              return (
                <button key={h} onClick={() => onOpen(p)} className="shrink-0 w-40 text-left">
                  <Image
                    src={p.img}
                    alt={h}
                    className="w-full aspect-square object-cover border border-foreground"
                  />
                  <p className="mt-2 headline font-semibold text-sm leading-tight">{h}s</p>
                  <span className="mt-1 inline-block label px-2 py-0.5" style={categoryStyle(h)}>
                    {h}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 px-4">
          <div className="flex items-baseline justify-between">
            <p className="display uppercase text-2xl leading-none">Explore SAF</p>
            <button onClick={onAll} className="label hover:text-accent">
              View all →
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {PROGRAMMES.slice(0, 4).map((p) => (
              <Card key={p.id} p={p} onOpen={onOpen} />
            ))}
          </div>
        </div>
      </Scroll>
      <TabBar active="home" onTab={onTab} />
    </>
  );
}

function Card({ p, onOpen }: { p: Programme; onOpen: (p: Programme) => void }) {
  return (
    <button onClick={() => onOpen(p)} className="text-left">
      <Image
        src={p.img}
        alt={p.title}
        className="w-full aspect-square object-cover border border-foreground"
      />
      <span className="mt-2 inline-block label px-2 py-0.5" style={categoryStyle(p.category)}>
        {p.category}
      </span>
      <p className="mt-1 headline font-semibold text-sm leading-tight">{p.title}</p>
      <p className="text-[11px] headline text-muted-foreground">
        {dateLabel(p)} · {timeLabel(p)}
      </p>
    </button>
  );
}

function Programmes({
  onOpen,
  onTab,
}: {
  onOpen: (p: Programme) => void;
  onTab: (s: Screen) => void;
}) {
  const cats = ["All", "Exhibition", "Performance", "Workshop", "Talk", "Film Screening"];
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? PROGRAMMES : PROGRAMMES.filter((p) => p.category === cat);
  return (
    <>
      <Scroll>
        <TopBar title="Programmes" />
        <div className="px-4 pt-4">
          <input
            placeholder="Search programmes, venues, curators"
            className="w-full border border-foreground bg-transparent px-3 py-2.5 headline text-sm outline-none"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="shrink-0 label notch border border-foreground px-3 py-1.5"
                style={
                  c === "All"
                    ? cat === c
                      ? { background: "#0A0A0A", color: "#FFFFFF" }
                      : undefined
                    : cat === c
                      ? categoryStyle(c)
                      : { color: categoryStyle(c).background }
                }
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {list.map((p) => (
              <Card key={p.id} p={p} onOpen={onOpen} />
            ))}
          </div>
        </div>
      </Scroll>
      <TabBar active="programmes" onTab={onTab} />
    </>
  );
}

function Detail({ p, onBack, onBook }: { p: Programme; onBack: () => void; onBook: () => void }) {
  return (
    <div className="h-full">
      <Scroll>
        <TopBar title="Programme details" onBack={onBack} />
        <div className="px-4 pt-4">
          <div className="flex gap-2">
            <span className="label px-2 py-0.5" style={categoryStyle(p.category)}>
              {p.category}
            </span>
            {p.tags.slice(0, 2).map((t) => (
              <span key={t} className="label border border-foreground px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
          <Image
            src={p.img}
            alt={p.title}
            className="mt-3 w-full aspect-[4/3] object-cover border border-foreground"
          />
          <p className="mt-3 label text-muted-foreground">{p.venue}</p>
          <p className="label text-muted-foreground">
            {dateLabel(p)} · {timeLabel(p)}
          </p>
          <h2 className="mt-2 display uppercase text-3xl leading-[0.9]">{p.title}</h2>
          <p className="mt-1 headline font-semibold text-lg text-accent">
            {p.price ? `INR ${p.price}` : "Free"}
          </p>
          <p className="mt-3 headline text-sm leading-snug text-muted-foreground">{p.blurb}</p>

          <p className="mt-6 display uppercase text-xl leading-none">Line up</p>
          <div className="mt-3 space-y-3">
            {(p.includes?.length
              ? p.includes.map((i) => ({ title: i.title, note: i.time }))
              : [{ title: p.title, note: dateLabel(p) }]
            ).map((i) => (
              <div key={i.title} className="flex gap-3 items-center border border-foreground p-2">
                <Image src={p.img} alt="" className="w-16 h-16 object-cover" />
                <div>
                  <p className="headline font-semibold text-sm leading-tight">{i.title}</p>
                  <p className="text-[11px] headline text-muted-foreground">{i.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Scroll>
      <div className="absolute bottom-0 inset-x-0 p-3 bg-background border-t border-foreground">
        <button
          onClick={onBook}
          className="w-full headline uppercase tracking-[0.06em] text-sm bg-foreground text-background py-3"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function Booking({
  p,
  onClose,
  onBook,
}: {
  p: Programme;
  onClose: () => void;
  onBook: () => void;
}) {
  const fields: [string, string][] = [
    ["Venue", p.venue],
    ["Date", dateLabel(p)],
    ["Time", timeLabel(p)],
    ["Qty", "2"],
    ["Amount", p.price ? `INR ${p.price}` : "Free"],
  ];
  return (
    <div className="h-full bg-foreground/80">
      <div className="absolute inset-x-0 bottom-0 bg-background border-t border-foreground">
        <GlitchBar seed={23} direction="h" speed={2} count={120} className="h-2 w-full" />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <p className="display uppercase text-xl leading-none">Fill your booking details</p>
            <button onClick={onClose} className="label border border-foreground px-2 py-0.5">
              ✕
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {fields.map(([k, v]) => (
              <div key={k}>
                <p className="label text-muted-foreground">{k}</p>
                <div className="mt-1 border border-foreground px-3 py-2.5 headline text-sm flex items-center justify-between">
                  <span>{v}</span>
                  <span className="text-muted-foreground">▾</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onBook}
            className="mt-5 w-full headline uppercase tracking-[0.06em] text-sm bg-foreground text-background py-3"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

function Success({ onCart }: { onCart: () => void }) {
  return (
    <div className="h-full bg-foreground/85 grid place-items-center p-6">
      <div className="w-full border border-background bg-background p-6 text-center">
        <div
          className="mx-auto h-16 w-16 grid place-items-center display text-3xl"
          style={{ background: "#62C6C2" }}
        >
          ✓
        </div>
        <p className="mt-4 display uppercase text-3xl leading-none">Success!</p>
        <p className="mt-2 headline text-sm text-muted-foreground">Your item is in the cart.</p>
        <button
          onClick={onCart}
          className="mt-5 w-full headline uppercase tracking-[0.06em] text-sm bg-foreground text-background py-3"
        >
          View cart
        </button>
      </div>
    </div>
  );
}

function Festival({ onTab }: { onTab: (s: Screen) => void }) {
  const items = [
    "Exhibitions",
    "Curators",
    "Event Feed",
    "F&B",
    "Feedback",
    "Helpdesk",
    "Venues",
    "Mercado",
    "Vibes",
    "Partners",
    "Volunteer",
    "Accessibility",
  ];
  const swatches = ["#B39ECC", "#2C499F", "#62C6C2", "#CEDC29", "#F47521", "#F26458"];
  return (
    <>
      <Scroll>
        <TopBar title="Festival" />
        <ul className="rule-t mx-4 mt-4">
          {items.map((it, i) => (
            <li key={it} className="rule-b">
              <button className="w-full py-4 flex items-center gap-3 text-left group">
                <span
                  className="h-6 w-6 shrink-0 border border-foreground"
                  style={{ background: swatches[i % swatches.length] }}
                />
                <span className="headline font-semibold text-base flex-1 group-hover:text-accent transition-colors">
                  {it}
                </span>
                <span className="label">→</span>
              </button>
            </li>
          ))}
        </ul>
      </Scroll>
      <TabBar active="festival" onTab={onTab} />
    </>
  );
}
