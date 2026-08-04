import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import {
  PROGRAMMES,
  type Programme,
  fmtSlot,
  fmtTime,

  fmtTimeRange,
  dateLabel,
  timeLabel,
  relatedProgrammes,
  programmeById,
} from "@/lib/programmes-data";
import { RecommendModal } from "@/components/site/RecommendModal";
import { GlitchBar } from "@/components/site/GlitchBar";
import { GlitchBorder } from "@/components/site/GlitchBorder";
import { categoryStyle, priceStyle, tagStyle } from "@/lib/tag-colors";

// Category slug ↔ display name mapping. Consumed by /programmes/$category.
export const CATEGORY_SLUGS: Record<string, string> = {
  exhibition: "Exhibition",
  performance: "Performance",
  workshop: "Workshop",
  talk: "Talk",
  "film-screening": "Film Screening",
};
const CATEGORY_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([slug, cat]) => [cat, slug]),
);

export const Route = createFileRoute("/programmes")({
  validateSearch: (s: Record<string, unknown>) => ({ p: typeof s.p === "string" ? s.p : undefined }),
  head: () => ({
    meta: [
      { title: "Programmes — Serendipity Arts Festival 2026" },
      {
        name: "description",
        content:
          "Exhibitions, performances, workshops, talks and film screenings. 13–20 December 2026, Panjim.",
      },
    ],
  }),
  component: () => <ProgrammesList />,
});


const VENUES = [
  "The Old GMC Complex", "Art Park", "Promenade", "Samba Square",
  "Arena at DB Ground", "ESG Building", "Directorate of Accounts",
];
const CATEGORIES = ["All", "Exhibition", "Performance", "Workshop", "Talk", "Film Screening"] as const;
const DAYS = [13, 14, 15, 16, 17, 18, 19, 20];
const TAGS = [
  "All Ages", "18+", "Free", "INR 99", "INR 249", "INR 499",
  "Music", "Dance", "Theatre", "Visual Arts", "Culinary Arts", "Crafts",
  "Children's Programmes", "Accessibility",
];

export function ProgrammesList({ initialCategory = "All" }: { initialCategory?: string }) {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [cat, setCat] = useState<string>(initialCategory);
  const [day, setDay] = useState<number | null>(null);
  const [venue, setVenue] = useState<string>("All");
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Programme | null>(null);
  const [activeIntent, setActiveIntent] = useState<"about" | "cart">("about");
  const { isVip } = useCart();

  useEffect(() => { setCat(initialCategory); }, [initialCategory]);

  useEffect(() => {
    if (search.p) {
      const found = PROGRAMMES.find((x) => x.id === search.p);
      if (found) { setActiveIntent("about"); setActive(found); }
    }
  }, [search.p]);

  const anyFilter = cat !== "All" || day !== null || venue !== "All" || tags.length > 0 || query.trim().length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (day === null || p.slots.some((s) => s.day === day)) &&
        (venue === "All" || p.venue === venue) &&
        (tags.length === 0 || tags.every((t) => p.tags.includes(t))) &&
        (q === "" ||
          p.title.toLowerCase().includes(q) ||
          p.blurb.toLowerCase().includes(q) ||
          p.curator.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)),
    ).sort((a, b) => a.title.localeCompare(b.title));
  }, [cat, day, venue, tags, query]);

  useEffect(() => { setPage(1); }, [cat, day, venue, tags, query]);

  const PER_PAGE = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const goToPage = (n: number) => {
    setPage(Math.min(totalPages, Math.max(1, n)));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Category selection updates the URL path — real, shareable URLs.
  const onCategoryChange = (next: string) => {
    setCat(next);
    if (next === "All") {
      navigate({ to: "/programmes" });
    } else {
      const slug = CATEGORY_TO_SLUG[next];
      if (slug) navigate({ to: "/programmes/$category", params: { category: slug } });
    }
  };

  return (
    <div className="container-editorial pt-10 md:pt-24 pb-32">
      <h1 className="display uppercase text-[15vw] md:text-[12vw] leading-[0.9]">Programmes</h1>

      <p className="mt-6 max-w-2xl hand text-xl md:text-3xl leading-[1.15] headline">
        We keep on adding new programmes — book them before they get sold out.
      </p>

      <div className="mt-4 inline-grid gap-3 justify-items-stretch">
        <HowToAttendCTA className="w-full justify-center" />
        

        {isVip && (
          <span className="headline text-xs uppercase tracking-[0.06em] border border-accent text-accent px-3 py-2">
            Special guest — all programmes complimentary
          </span>
        )}
      </div>

      {/* SEARCH */}
      <div className="mt-10 md:mt-14">
        <p className="label mb-3">Search programmes</p>
        <div className="border border-foreground px-4 md:px-5 py-3 md:py-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, descriptions…"
            className="w-full bg-transparent outline-none text-base md:text-lg headline"
          />
        </div>
      </div>

      {/* FILTERS — matching border weight */}
      <div className="mt-8">
        <p className="label mb-3">Filters</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <FilterSelect label="Select Date" value={day === null ? "All" : `${day} Dec`}
            options={["All", ...DAYS.map((d) => `${d} Dec`)]}
            onChange={(v) => setDay(v === "All" ? null : parseInt(v))} />
          <FilterSelect label="Select Category" value={cat}
            options={[...CATEGORIES]}
            onChange={onCategoryChange} />
          <FilterSelect label="Select Venue" value={venue}
            options={["All", ...VENUES]}
            onChange={setVenue} />
          <FilterSelect label="Select Tag" value={tags[0] ?? "All"}
            options={["All", ...TAGS]}
            onChange={(v) => setTags(v === "All" ? [] : [v])} />
        </div>
        {anyFilter && (
          <button
            onClick={() => {
              setCat("All"); setDay(null); setVenue("All"); setTags([]); setQuery("");
              navigate({ to: "/programmes" });
            }}
            className="mt-3 label text-muted-foreground hover:text-accent transition-colors"
          >
            Clear all ×
          </button>
        )}
      </div>

      <p className="mt-8 label text-muted-foreground">
        {filtered.length} programme{filtered.length === 1 ? "" : "s"} · Page {currentPage} of {totalPages}
      </p>

      <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
        {paged.map((p) => (
          <ProgrammeCard
            key={p.id}
            programme={p}
            onAbout={() => { setActiveIntent("about"); setActive(p); }}
            onAdd={() => { setActiveIntent("cart"); setActive(p); }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 label text-muted-foreground">No programmes match these filters.</p>
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-4 py-2 disabled:opacity-40 hover:bg-foreground hover:text-background transition-colors"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => goToPage(n)}
              aria-current={n === currentPage ? "page" : undefined}
              className={`headline text-xs uppercase tracking-[0.06em] min-w-[40px] px-3 py-2 border ${
                n === currentPage
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground hover:bg-foreground hover:text-background"
              } transition-colors`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-4 py-2 disabled:opacity-40 hover:bg-foreground hover:text-background transition-colors"
          >
            Next →
          </button>
        </nav>
      )}

      {active && (
        <BookingSheet
          programme={active}
          intent={activeIntent}
          onClose={() => setActive(null)}
          onOpen={(p) => { setActiveIntent("about"); setActive(p); }}
        />
      )}
    </div>
  );
}


function ProgrammeCard({ programme: p, onAbout, onAdd }: { programme: Programme; onAbout: () => void; onAdd: () => void }) {
  const { wishlist, toggleWish, isVip } = useCart();
  const saved = wishlist.includes(p.id);
  const priceLabel = isVip ? "Guest" : p.price === 0 ? "Free" : `₹${p.price}`;

  return (
    <div className="group block text-left relative">
      <button
        onClick={(e) => { e.stopPropagation(); toggleWish(p.id); }}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute top-2 right-2 z-20 bg-background/85 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-accent text-accent" : "text-foreground"}`} strokeWidth={1.75} />
      </button>
      <button onClick={onAbout} className="w-full text-left">
        <GlitchBorder seed={p.id.length + 2} thickness={1} hoverBoost={14} delayMs={200} className="overflow-hidden">
          <div className="relative">
            <img src={p.img} alt={p.title} loading="lazy"
              className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
            {p.newlyAdded && (
              <span className="absolute top-2 left-2 label px-2 py-1" style={{ background: "#CEDC29", color: "#0A0A0A" }}>
                New
              </span>
            )}
          </div>
        </GlitchBorder>
        <div className="mt-3">
          <h3 className="headline font-semibold text-sm md:text-lg leading-tight tracking-[-0.01em] group-hover:text-accent transition-colors break-words hyphens-auto">
            {p.title}
          </h3>
          <p className="mt-1 text-[11px] md:text-xs text-muted-foreground headline">{dateLabel(p)} · {timeLabel(p)} · {p.venue}</p>
          {/* Tags — under the image so nothing gets clipped on mobile */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="label px-1.5 py-0.5 text-[9px] md:text-[10px] leading-tight max-w-full break-words" style={categoryStyle(p.category)}>
              {p.category}
            </span>
            {p.tags?.[0] && (
              <span className="label px-1.5 py-0.5 text-[9px] md:text-[10px] leading-tight max-w-full break-words" style={tagStyle(p.tags[0])}>
                {p.tags[0]}
              </span>
            )}
            <span className="label px-1.5 py-0.5 text-[9px] md:text-[10px] leading-tight" style={priceStyle(priceLabel)}>
              {priceLabel}
            </span>
          </div>
        </div>
      </button>
      <div className="mt-3 grid grid-cols-2 border border-foreground divide-x divide-foreground">
        <button
          onClick={onAbout}
          className="headline text-[11px] md:text-xs uppercase tracking-[0.06em] px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          About
        </button>
        <button
          onClick={onAdd}
          className="headline text-[11px] md:text-xs uppercase tracking-[0.06em] px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  const active = value !== "All";
  return (
    <label className={`relative flex items-center justify-between gap-2 border px-3 md:px-4 py-2 md:py-3 cursor-pointer ${active ? "border-accent" : "border-foreground"}`}>
      <span className={`label ${active ? "text-accent" : "text-foreground"}`}>
        {active ? value : label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="absolute opacity-0 inset-0 w-full h-full cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span aria-hidden className={`label ${active ? "text-accent" : "text-muted-foreground"}`}>▾</span>
    </label>
  );
}


function RecommendCTA({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 border border-foreground px-4 py-2 headline text-xs uppercase tracking-[0.06em] hover:bg-foreground hover:text-background transition-colors ${className}`}
      >

        ⓘ Let us help you — recommend programmes
      </button>
      <RecommendModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function HowToAttendCTA({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 border border-foreground px-4 py-2 headline text-xs uppercase tracking-[0.06em] hover:bg-foreground hover:text-background transition-colors ${className}`}
      >
        ⓘ How to book programmes
      </button>
      {open && (
        <Modal onClose={() => setOpen(false)} label="How to book">
          <h3 className="display uppercase text-2xl md:text-4xl leading-[1] tracking-[-0.02em]">
            Booking programmes is easy.
          </h3>
          <ol className="mt-6 space-y-4 text-sm md:text-base text-muted-foreground max-w-prose headline list-decimal pl-5">
            <li><span className="text-foreground">Register</span> for the festival — it's free.</li>
            <li>Browse programmes and hit <span className="text-foreground">Add to cart</span> on the ones you want.</li>
            <li>Pick a <span className="text-foreground">date and time slot</span>, choose the number of tickets, and confirm.</li>
            <li>Head to your <span className="text-foreground">cart</span> and complete checkout — free programmes and paid ones can be booked together.</li>
            <li>Your bookings get added to a single <span className="text-foreground">Art Pass</span> on our app, available to download closer to the festival. Just show it at any venue in front of our zappers.</li>
          </ol>
        </Modal>
      )}
    </>
  );
}

function BookingSheet({ programme, intent, onClose, onOpen }: { programme: Programme; intent: "about" | "cart"; onClose: () => void; onOpen: (p: Programme) => void }) {
  const [qty, setQty] = useState(1);
  const [slotIdx, setSlotIdx] = useState(0);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [clashItem, setClashItem] = useState<{ title: string; date: string; time: string } | null>(null);
  const [showRegisterGate, setShowRegisterGate] = useState(false);
  const { add, items, bookings, isVip, isRegistered, markJustBooked } = useCart();
  const navigate = useNavigate();

  const addBoxRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setQty(1);
    setSlotIdx(0);
    setAddOnIds([]);
    setExpanded(false);
  }, [programme.id]);

  useEffect(() => {
    if (intent !== "cart") return;
    const timer = window.setTimeout(() => {
      addBoxRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [intent, programme.id]);

  const effectivePrice = isVip ? 0 : programme.price;
  const chosenAddOns = (programme.addOns ?? []).filter((a) => addOnIds.includes(a.id));
  const addOnsPrice = chosenAddOns.reduce((sum, a) => sum + (isVip ? 0 : a.price), 0);
  const total = (effectivePrice + addOnsPrice) * qty;


  const hasLong = !!programme.longBlurb;
  const chosenSlot = programme.slots[slotIdx];
  const chosenDate = `${chosenSlot.day} Dec`;
  const chosenTime = fmtTimeRange(chosenSlot);
  const cartId = `${programme.id}-${chosenSlot.day}-${chosenSlot.time}`;
  const related = relatedProgrammes(programme, 3);
  // Sub-programmes of a day pass can't be booked alone — they come with the parent.
  const parent = PROGRAMMES.find((x) => x.includes?.some((i) => i.refId === programme.id));


  const findClash = () => {
    if (programme.category === "Exhibition") return null;
    if (items.some((i) => i.id === cartId)) return null;
    const chosenDay = chosenSlot.day;
    const chosenStart = chosenSlot.time;
    // Cart ids encode the slot: "<programmeId>-<day>-<HH:MM>" — parse that
    // instead of the human-readable date/time strings, which are ambiguous.
    const slotOf = (id: string) => {
      const m = id.match(/-(\d{1,2})-(\d{2}:\d{2})$/);
      return m ? { day: Number(m[1]), time: m[2] } : null;
    };
    return [...bookings, ...items].find((i) => {
      if (i.id === cartId) return false;
      const s = slotOf(i.id);
      return !!s && s.day === chosenDay && s.time === chosenStart;
    }) ?? null;
  };



  const doAdd = () => {
    add({
      id: cartId, title: programme.title, venue: programme.venue,
      date: chosenDate, time: chosenTime, price: effectivePrice, img: programme.img,
    }, qty);
    // Extended / micro programming is booked as its own line item.
    for (const a of chosenAddOns) {
      add({
        id: `${programme.id}-${a.id}-${a.day}-${a.time}`,
        title: a.title,
        venue: programme.venue,
        date: `${a.day} Dec`,
        time: fmtTimeRange({ day: a.day, time: a.time }),
        price: isVip ? 0 : a.price,
        img: programme.img,
      }, qty);
    }
    markJustBooked();
  };


  const handleAddToCart = () => {
    // Clash check runs first so the user sees the conflict before any gate.
    const clash = findClash();
    if (clash) { setClashItem({ title: clash.title, date: clash.date, time: clash.time }); return; }
    if (!isRegistered) {
      setShowRegisterGate(true);
      return;
    }
    doAdd();
    // Navigate to full-screen confirmation route instead of a popup.
    onClose();
    navigate({ to: "/cart/added", search: { id: cartId } as never });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">
      <GlitchBar seed={11} direction="v" variant="vibrate" speed={0.4} count={90} className="fixed left-0 top-0 bottom-0 w-1.5 z-10" />
      <GlitchBar seed={29} direction="v" variant="bulge" speed={1.8} count={90} className="fixed right-0 top-0 bottom-0 w-1.5 z-10" />

      <div className="container-editorial pt-6 md:pt-10 pb-16">
        <div className="flex items-center justify-between rule-b pb-4">
          <p className="label">Booking</p>
          <button onClick={onClose} className="label hover:text-accent">Close &nbsp;×</button>
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <div className="md:col-span-6">
            <img src={programme.img} alt={programme.title} className="w-full aspect-square object-cover" />
          </div>

          <div className="md:col-span-6">
            <p className="label text-muted-foreground">{programme.category}</p>
            <h2 className="mt-3 display uppercase text-3xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
              {programme.title}
            </h2>

            <section className="mt-4 border border-rule p-4 md:p-5">
              <p className="label text-muted-foreground mb-3">About</p>
              <div className="max-w-prose text-base leading-relaxed headline">
              <p className={hasLong && !expanded ? "line-clamp-4 text-muted-foreground" : "text-muted-foreground"}>
                {expanded && hasLong ? programme.longBlurb : programme.blurb}
              </p>
              {hasLong && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-3 label text-accent hover:underline underline-offset-4"
                >
                  {expanded ? "Read less −" : "Read more +"}
                </button>
              )}
              </div>
            </section>

            <dl className="mt-6 md:mt-8 grid grid-cols-2 gap-y-3 text-sm rule-t rule-b py-4 headline">
              <dt className="label text-muted-foreground">Curator</dt><dd>{programme.curator}</dd>
              <dt className="label text-muted-foreground">Date</dt><dd>{dateLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Time</dt><dd>{timeLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Venue</dt><dd>{programme.venue}</dd>
              <dt className="label text-muted-foreground">Price</dt>
              <dd>{effectivePrice === 0 ? (isVip && programme.price > 0 ? "Complimentary — Special guest" : "Free") : `₹${effectivePrice} per ticket`}</dd>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {programme.tags.map((t) => (
                <span key={t} className="label px-2 py-1" style={tagStyle(t)}>{t}</span>
              ))}
            </div>

            <section ref={addBoxRef} className={`mt-8 border p-4 md:p-5 ${intent === "cart" ? "border-accent" : "border-foreground"}`}>
              <label className="label text-muted-foreground">Select a date &amp; time</label>
              <div className="mt-3 mb-6 flex flex-wrap gap-2">
                {programme.slots.map((s, i) => (
                  <button
                    key={`${s.day}-${s.time}`}
                    onClick={() => setSlotIdx(i)}
                    className={`headline text-xs uppercase tracking-[0.06em] border px-3 py-2 transition-colors ${
                      slotIdx === i
                        ? "bg-foreground text-background border-foreground"
                        : "border-foreground hover:bg-foreground hover:text-background"
                    }`}
                  >
                    {fmtSlot(s)}
                  </button>
                ))}
              </div>

              {programme.includes && programme.includes.length > 0 && (
                <div className="mb-6 border border-foreground p-3 md:p-4">
                  <p className="label text-muted-foreground">
                    Included in this booking — {programme.includes.length} programmes
                  </p>
                  <ul className="mt-3 divide-y divide-rule">
                    {programme.includes.map((inc) => {
                      const ref = programmeById(inc.refId);
                      return (
                        <li key={inc.title} className="py-2">
                          <button
                            type="button"
                            disabled={!ref}
                            onClick={() => ref && onOpen(ref)}
                            className="w-full flex items-center gap-3 text-left group disabled:cursor-default"
                          >
                            {ref && (
                              <img src={ref.img} alt="" className="w-14 h-14 object-cover border border-foreground shrink-0" />
                            )}
                            <span className="flex-1 flex flex-wrap items-baseline justify-between gap-2">
                              <span className="headline text-sm group-hover:underline underline-offset-4">{inc.title}</span>
                              <span className="headline text-xs text-muted-foreground">
                                {fmtTime(inc.time)}{inc.note ? ` · ${inc.note}` : ""} · {inc.category}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground headline">
                    You book the day — every programme above is covered by this one ticket.
                  </p>
                </div>
              )}

              {programme.addOns && programme.addOns.length > 0 && (
                <div className="mb-6 border border-foreground p-3 md:p-4">
                  <p className="label text-muted-foreground">Extended programming — optional</p>
                  <div className="mt-3 space-y-3">
                    {programme.addOns.map((a) => {
                      const on = addOnIds.includes(a.id);
                      const ref = programmeById(a.id);
                      const priceLabel = isVip || a.price === 0 ? "Free" : `₹${a.price}`;
                      return (
                        <div key={a.id} className="border border-foreground p-3 flex flex-col sm:flex-row gap-3">
                          <img
                            src={ref?.img ?? programme.img}
                            alt={a.title}
                            className="w-full sm:w-28 h-28 object-cover border border-foreground shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="headline text-sm leading-tight">{a.title}</p>
                            <p className="mt-1 headline text-xs text-muted-foreground">
                              {a.day} Dec · {fmtTimeRange({ day: a.day, time: a.time })} · {a.category}
                            </p>
                            {a.blurb && <p className="mt-2 headline text-xs text-muted-foreground">{a.blurb}</p>}
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <span className="display text-2xl leading-none">{priceLabel}</span>
                              <button
                                onClick={() =>
                                  setAddOnIds((prev) => (on ? prev.filter((x) => x !== a.id) : [...prev, a.id]))
                                }
                                aria-pressed={on}
                                className={`headline text-xs uppercase tracking-[0.08em] border border-foreground px-5 py-2.5 transition-colors ${
                                  on ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"
                                }`}
                              >
                                {on ? "Added ✓" : "Add to cart"}
                              </button>
                              {ref && (
                                <button
                                  onClick={() => onOpen(ref)}
                                  className="headline text-xs uppercase tracking-[0.08em] underline underline-offset-4"
                                >
                                  View programme
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {parent ? (
                <div className="border border-foreground p-4">
                  <p className="label text-muted-foreground">Part of a day booking</p>
                  <p className="mt-2 headline text-sm">
                    This programme can't be booked on its own — it's included in{" "}
                    <span className="text-foreground font-semibold">{parent.title}</span>. Book the day and this is yours.
                  </p>
                  <button
                    onClick={() => onOpen(parent)}
                    className="mt-4 headline uppercase tracking-[0.06em] text-sm md:text-base bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
                  >
                    Book {parent.title} →
                  </button>
                </div>
              ) : (
              <>
              <label className="label text-muted-foreground">Tickets</label>
              <div className="mt-2 flex items-center gap-6">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="display text-3xl w-10">−</button>
                <span className="display text-4xl tabular-nums w-10 text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(isVip ? 2 : 6, qty + 1))} className="display text-3xl w-10">+</button>
              </div>

              <div className="mt-5">
                <label className="label text-muted-foreground">Discount code</label>
                <input placeholder="Enter code (optional)" className="input mt-2 max-w-xs" />
              </div>

              <button
                onClick={() => setShowTerms(true)}
                className="mt-6 label text-accent hover:underline underline-offset-4"
              >
                Read disclaimer +
              </button>

              <div className="mt-6 flex items-center justify-between rule-t pt-4 gap-4 flex-wrap">
                <p className="display text-3xl md:text-4xl">
                  {effectivePrice === 0 ? "Free" : `₹${total}`}
                </p>
                <button
                  onClick={handleAddToCart}
                  className="headline uppercase tracking-[0.06em] text-sm md:text-base bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
                >
                  Add to cart →
                </button>

              </div>
              </>
              )}

            </section>
          </div>
        </div>

        {/* RELATED PROGRAMMES */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24 rule-t pt-10">
            <h3 className="display uppercase text-2xl md:text-4xl leading-none">You might also like</h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 items-start">
              {related.map((r) => (
                <ProgrammeCard
                  key={r.id}
                  programme={r}
                  onAbout={() => { setSlotIdx(0); setExpanded(false); onOpen(r); }}
                  onAdd={() => { setSlotIdx(0); setExpanded(false); onOpen(r); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showTerms && (
        <SidePanel onClose={() => setShowTerms(false)} label="Disclaimer">
          <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
            Please read before booking.
          </h3>
          <p className="mt-4 text-sm text-muted-foreground headline">
            Read the full <Link to="/terms" className="text-foreground underline underline-offset-4">Terms &amp; Conditions</Link>.
          </p>
        </SidePanel>
      )}

      {clashItem && (
        <Modal onClose={() => setClashItem(null)} label="Time clash">
          <h3 className="display uppercase text-3xl md:text-5xl leading-[0.95] tracking-[-0.02em]">
            You've already booked something at this time.
          </h3>
          <p className="mt-4 text-muted-foreground headline">
            <span className="text-foreground">{clashItem.title}</span> — {clashItem.date} at {clashItem.time}.
            You can't be in two places at once — but you can book both if you'd like.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setClashItem(null);
                if (!isRegistered) { setShowRegisterGate(true); return; }
                doAdd();
                onClose();
                navigate({ to: "/cart/added", search: { id: cartId } as never });
              }}
              className="headline text-xs uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent transition-colors"
            >
              Proceed anyway →
            </button>
            <button onClick={() => setClashItem(null)} className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors">
              Keep browsing
            </button>
            <Link to="/cart" className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors">
              Go to cart →
            </Link>
          </div>
        </Modal>
      )}

      {showRegisterGate && (
        <Modal onClose={() => setShowRegisterGate(false)} label="Registration required">
          <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
            Complete your registration first.
          </h3>
          <p className="mt-4 text-muted-foreground headline max-w-prose">
            Booking programmes is limited to registered visitors. It's free and takes a minute — you'll come right back to this programme after.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowRegisterGate(false);
                navigate({ to: "/register", search: { next: `/programmes?p=${programme.id}` } as never });
              }}
              className="headline text-xs uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent transition-colors"
            >
              Register now →
            </button>
            <button
              onClick={() => {
                setShowRegisterGate(false);
                navigate({ to: "/login", search: { next: `/programmes?p=${programme.id}` } as never });
              }}
              className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Already registered — log in →
            </button>
            <button
              onClick={() => setShowRegisterGate(false)}
              className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Not now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ label, children, onClose }: { label: string; children: React.ReactNode; onClose: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-background border border-rule ed-fade overflow-hidden">
        <GlitchBar seed={19} direction="v" speed={5} count={60} className="absolute left-0 top-0 bottom-0 w-1.5" />
        <div className="p-6 md:p-10 pl-8 md:pl-12">
          <div className="flex items-center justify-between rule-b pb-3 mb-6">
            <p className="label text-accent">{label}</p>
            <button onClick={onClose} className="label hover:text-accent">Close ×</button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SidePanel({ label, children, onClose }: { label: string; children: React.ReactNode; onClose: () => void }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-stretch md:justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <aside className="relative w-full max-h-[80vh] md:max-h-none md:h-full md:w-full md:max-w-md bg-background border-t md:border-t-0 md:border-l border-foreground overflow-y-auto ed-slide-in">
        <GlitchBar seed={19} direction="v" speed={5} count={60} className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5" />
        <div className="p-6 md:p-10 md:pl-12">
          <div className="flex items-center justify-between rule-b pb-3 mb-6">
            <p className="label text-accent">{label}</p>
            <button onClick={onClose} className="label hover:text-accent">Close ×</button>
          </div>
          {children}
        </div>
      </aside>
    </div>,
    document.body,
  );
}

