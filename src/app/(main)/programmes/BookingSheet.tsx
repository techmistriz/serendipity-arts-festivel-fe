"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
} from "@/data/programmes-data";

import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { tagStyle } from "@/lib/tag-colors";

import GlitchBar from "@/components/common/GlitchBar";

import { SidePanel } from "./SidePanel";

import { ProgrammeCard } from "./_components/ProgrammeCard";
import { Modal } from "./Modal";

export function BookingSheet({
  programme,
  intent,
  onClose,
  onOpen,
}: {
  programme: Programme;
  intent: "about" | "cart";
  onClose: () => void;
  onOpen: (p: Programme) => void;
}) {
  const { isAuthenticated } = useAuth();

  const [qty, setQty] = useState(1);
  const [slotIdx, setSlotIdx] = useState(0);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const [showTerms, setShowTerms] = useState(false);
  const [clashItem, setClashItem] = useState<{
    title: string;
    date: string;
    time: string;
  } | null>(null);

  const [showRegisterGate, setShowRegisterGate] = useState(false);

  const { add, items, bookings, isVip } = useCart();

  const router = useRouter();

  const addBoxRef = useRef<HTMLElement>(null);

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
  const chosenSlot = programme.slots[slotIdx] ?? null;

  const chosenDate = chosenSlot ? `${chosenSlot.day} Dec` : "Date TBA";

  const chosenTime = chosenSlot ? fmtTimeRange(chosenSlot) : "Time TBA";
  const cartId = chosenSlot
    ? `${programme.id}-${chosenSlot.day}-${chosenSlot.time}`
    : `${programme.id}-unscheduled`;
  const related = relatedProgrammes(programme, 3);
  // Sub-programmes of a day pass can’t be booked alone — they come with the parent.
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
    return (
      [...bookings, ...items].find((i) => {
        if (i.id === cartId) return false;
        const s = slotOf(i.id);
        return !!s && s.day === chosenDay && s.time === chosenStart;
      }) ?? null
    );
  };

  const doAdd = () => {
    add(
      {
        id: cartId,
        title: programme.title,
        venue: programme.venue,
        date: chosenDate,
        time: chosenTime,
        price: effectivePrice,
        img: programme.img,
      },
      qty,
    );
    // Extended / micro programming is booked as its own line item.
    for (const a of chosenAddOns) {
      add(
        {
          id: `${programme.id}-${a.id}-${a.day}-${a.time}`,
          title: a.title,
          venue: programme.venue,
          date: `${a.day} Dec`,
          time: fmtTimeRange({ day: a.day, time: a.time }),
          price: isVip ? 0 : a.price,
          img: programme.img,
        },
        qty,
      );
    }
  };

  const handleAddToCart = () => {
    const clash = findClash();

    if (clash) {
      setClashItem({
        title: clash.title,
        date: clash.date,
        time: clash.time,
      });
      return;
    }

    if (!isAuthenticated) {
      setShowRegisterGate(true);
      return;
    }

    doAdd();

    onClose();

    router.push(`/cart/added?id=${encodeURIComponent(cartId)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto ed-fade">
      <GlitchBar
        seed={11}
        direction="v"
        variant="vibrate"
        speed={0.4}
        count={90}
        className="fixed left-0 top-0 bottom-0 w-1.5 z-10"
      />
      <GlitchBar
        seed={29}
        direction="v"
        variant="bulge"
        speed={1.8}
        count={90}
        className="fixed right-0 top-0 bottom-0 w-1.5 z-10"
      />

      <div className="container-editorial pt-6 md:pt-10 pb-16">
        <div className="flex items-center justify-between rule-b pb-4">
          <p className="label">Booking</p>
          <button onClick={onClose} className="label hover:text-accent">
            Close &nbsp;×
          </button>
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <div className="md:col-span-6">
            <div className="relative w-full aspect-square">
              <Image
                src={programme.img}
                alt={programme.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-6">
            <p className="label text-muted-foreground">{programme.category}</p>
            <h2 className="mt-3 display uppercase text-3xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
              {programme.title}
            </h2>

            <section className="mt-4 border border-rule p-4 md:p-5">
              <p className="label text-muted-foreground mb-3">About</p>
              <div className="max-w-prose text-base leading-relaxed headline">
                <p
                  className={
                    hasLong && !expanded
                      ? "line-clamp-4 text-muted-foreground"
                      : "text-muted-foreground"
                  }
                >
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
              <dt className="label text-muted-foreground">Curator</dt>
              <dd>{programme.curator}</dd>
              <dt className="label text-muted-foreground">Date</dt>
              <dd>{dateLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Time</dt>
              <dd>{timeLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Venue</dt>
              <dd>{programme.venue}</dd>
              <dt className="label text-muted-foreground">Price</dt>
              <dd>
                {effectivePrice === 0
                  ? isVip && programme.price > 0
                    ? "Complimentary — Special guest"
                    : "Free"
                  : `₹${effectivePrice} per ticket`}
              </dd>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {programme.tags.map((t) => (
                <span key={t} className="label px-2 py-1" style={tagStyle(t)}>
                  {t}
                </span>
              ))}
            </div>

            <section
              ref={addBoxRef}
              className={`mt-8 border p-4 md:p-5 ${intent === "cart" ? "border-accent" : "border-foreground"}`}
            >
              {programme.slots.length > 0 ? (
                <>
                  <label className="label text-muted-foreground">Select a date & time</label>

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
                </>
              ) : (
                <div className="mb-6 border border-foreground p-4">
                  <p className="label text-muted-foreground">Schedule</p>

                  <p className="mt-2 headline text-sm text-muted-foreground">
                    Date and time will be announced.
                  </p>
                </div>
              )}

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
                              <div className="relative w-14 h-14 border border-foreground shrink-0">
                                <Image
                                  src={ref.img}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="flex-1 flex flex-wrap items-baseline justify-between gap-2">
                              <span className="headline text-sm group-hover:underline underline-offset-4">
                                {inc.title}
                              </span>
                              <span className="headline text-xs text-muted-foreground">
                                {fmtTime(inc.time)}
                                {inc.note ? ` · ${inc.note}` : ""} · {inc.category}
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
                        <div
                          key={a.id}
                          className="border border-foreground p-3 flex flex-col sm:flex-row gap-3"
                        >
                          <Image
                            src={ref?.img ?? programme.img}
                            alt={a.title}
                            className="w-full sm:w-28 h-28 object-cover border border-foreground shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="headline text-sm leading-tight">{a.title}</p>
                            <p className="mt-1 headline text-xs text-muted-foreground">
                              {a.day} Dec · {fmtTimeRange({ day: a.day, time: a.time })} ·{" "}
                              {a.category}
                            </p>
                            {a.blurb && (
                              <p className="mt-2 headline text-xs text-muted-foreground">
                                {a.blurb}
                              </p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <span className="display text-2xl leading-none">{priceLabel}</span>
                              <button
                                onClick={() =>
                                  setAddOnIds((prev) =>
                                    on ? prev.filter((x) => x !== a.id) : [...prev, a.id],
                                  )
                                }
                                aria-pressed={on}
                                className={`headline text-xs uppercase tracking-[0.08em] border border-foreground px-5 py-2.5 transition-colors ${
                                  on
                                    ? "bg-foreground text-background"
                                    : "hover:bg-foreground hover:text-background"
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
                    This programme can’t be booked on its own — it’s included in{" "}
                    <span className="text-foreground font-semibold">{parent.title}</span>. Book the
                    day and this is yours.
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
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="display text-3xl w-10"
                    >
                      −
                    </button>
                    <span className="display text-4xl tabular-nums w-10 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(isVip ? 2 : 6, qty + 1))}
                      className="display text-3xl w-10"
                    >
                      +
                    </button>
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
            <h3 className="display uppercase text-2xl md:text-4xl leading-none">
              You might also like
            </h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 items-start">
              {related.map((r) => (
                <ProgrammeCard
                  key={r.id}
                  programme={r}
                  onAbout={() => {
                    setSlotIdx(0);
                    setExpanded(false);
                    onOpen(r);
                  }}
                  onAdd={() => {
                    setSlotIdx(0);
                    setExpanded(false);
                    onOpen(r);
                  }}
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
            Read the full{" "}
            <Link href="/terms" className="text-foreground underline underline-offset-4">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </SidePanel>
      )}

      {clashItem && (
        <Modal onClose={() => setClashItem(null)} label="Time clash">
          <h3 className="display uppercase text-3xl md:text-5xl leading-[0.95] tracking-[-0.02em]">
            You’ve already booked something at this time.
          </h3>
          <p className="mt-4 text-muted-foreground headline">
            <span className="text-foreground">{clashItem.title}</span> — {clashItem.date} at{" "}
            {clashItem.time}. You can’t be in two places at once — but you can book both if you’d
            like.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setClashItem(null);
                if (!isAuthenticated) {
                  setShowRegisterGate(true);
                  return;
                }
                doAdd();
                onClose();
                router.push(`/cart/added?id=${encodeURIComponent(cartId)}`);
              }}
              className="headline text-xs uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent transition-colors"
            >
              Proceed anyway →
            </button>
            <button
              onClick={() => setClashItem(null)}
              className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Keep browsing
            </button>
            <Link
              href="/cart"
              className="headline text-xs uppercase tracking-[0.06em] border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              Go to cart →
            </Link>
          </div>
        </Modal>
      )}

      {/* {showRegisterGate && (
                <Modal onClose={() => setShowRegisterGate(false)} label="Registration required">
                    <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                        Complete your registration first.
                    </h3>
                    <p className="mt-4 text-muted-foreground headline max-w-prose">
                        Booking programmes is limited to registered visitors. It’s free and takes a minute — you’ll come right back to this programme after.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                setShowRegisterGate(false);

                                router.push(
                                    `/register?next=${encodeURIComponent(
                                        `/programmes?p=${programme.id}`
                                    )}`
                                );
                            }}
                            className="headline text-xs uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent transition-colors"
                        >
                            Register now →
                        </button>
                        <button
                            onClick={() => {
                                setShowRegisterGate(false);
                                router.push(
                                    `/login?next=${encodeURIComponent(
                                        `/programmes?p=${programme.id}`
                                    )}`
                                );
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
            )} */}

      {showRegisterGate && (
        <Modal onClose={() => setShowRegisterGate(false)} label="Registration required">
          <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
            Complete your registration first.
          </h3>
          <p className="mt-4 text-muted-foreground headline max-w-prose">
            Booking programmes is limited to registered visitors. It’s free and takes a minute —
            you’ll come right back to this programme after.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setShowRegisterGate(false);
                router.push(
                  `/register?next=${encodeURIComponent(`/programmes?p=${programme.id}`)}`,
                );
              }}
              className="headline text-xs uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-5 py-3 hover:bg-accent transition-colors"
            >
              Register now →
            </button>
            <button
              onClick={() => {
                setShowRegisterGate(false);
                router.push(`/login?next=${encodeURIComponent(`/programmes?p=${programme.id}`)}`);
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
