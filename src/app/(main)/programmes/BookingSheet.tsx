"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { UIProgramme } from "@/types/programme";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { tagStyle } from "@/lib/tag-colors";

import GlitchBar from "@/components/common/GlitchBar";
import { SidePanel } from "./SidePanel";
import { ProgrammeCard } from "./_components/ProgrammeCard";
import { Modal } from "./Modal";

// ===== Constants =====
const PLACEHOLDER_IMAGE = "/placeholder-image.jpg";
const DEFAULT_DURATION_MIN = 90;
const MAX_TICKETS = 6;
const VIP_MAX_TICKETS = 2;
const RELATED_LIMIT = 3;
const SCROLL_DELAY_MS = 120;
const ANIMATION_DURATION_MS = 300;

// ===== Helper Functions =====
const formatTime = (time: string) => {
  if (!time) return "TBA";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
};

const formatTimeRange = (
  slot: { day: number; time: string },
  durationMin = DEFAULT_DURATION_MIN,
) => {
  const [h, m] = slot.time.split(":").map(Number);
  const total = h * 60 + m + durationMin;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  const end = `${nh.toString().padStart(2, "0")}:${nm.toString().padStart(2, "0")}`;
  const [eh] = end.split(":").map(Number);
  const period = eh >= 12 ? "PM" : "AM";
  const startH = h % 12 === 0 ? 12 : h % 12;
  const endH = eh % 12 === 0 ? 12 : eh % 12;
  return `${startH}:${m.toString().padStart(2, "0")} – ${endH}:${nm.toString().padStart(2, "0")} ${period}`;
};

const formatSlot = (slot: { day: number; time: string }) =>
  `${slot.day} Dec · ${formatTimeRange(slot)}`;

const getDateLabel = (programme: UIProgramme) => {
  if (!programme.slots?.length) return "Date TBA";
  const uniqDays = Array.from(new Set(programme.slots.map((s) => s.day))).sort((a, b) => a - b);
  if (uniqDays.length === 1) return `${uniqDays[0]} Dec`;
  if (uniqDays.length >= 6) return `${uniqDays[0]}–${uniqDays[uniqDays.length - 1]} Dec`;
  return `${uniqDays.join(", ")} Dec`;
};

const getTimeLabel = (programme: UIProgramme) => {
  if (!programme.slots?.length) return "Time TBA";
  return formatTimeRange(programme.slots[0]);
};

const findRelatedProgrammes = (
  programme: UIProgramme,
  allProgrammes: UIProgramme[],
  limit = RELATED_LIMIT,
) => {
  if (!allProgrammes?.length) return [];

  const tagSet = new Set(programme.tags || []);
  const scored = allProgrammes
    .filter((x) => x.id !== programme.id)
    .map((x) => {
      let score = 0;
      if (x.curator === programme.curator) score += 3;
      if (x.category === programme.category) score += 2;
      if (x.tags) {
        for (const t of x.tags) {
          if (tagSet.has(t)) score += 1;
        }
      }
      return { programme: x, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.programme);

  return scored;
};

// ===== Types =====
interface ClashItem {
  title: string;
  date: string;
  time: string;
}

interface BookingSheetProps {
  programme: UIProgramme;
  intent: "about" | "cart";
  onClose: () => void;
  onOpen: (programme: UIProgramme) => void;
  allProgrammes?: UIProgramme[];
}

// ===== Main Component =====
export function BookingSheet({
  programme,
  intent,
  onClose,
  onOpen,
  allProgrammes = [],
}: BookingSheetProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { add, items, bookings, isVip } = useCart();

  // State
  const [quantity, setQuantity] = useState(1);
  const [slotIndex, setSlotIndex] = useState(0);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [clashItem, setClashItem] = useState<ClashItem | null>(null);
  const [showRegisterGate, setShowRegisterGate] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const addBoxRef = useRef<HTMLElement>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized values
  const effectivePrice = useMemo(
    () => (isVip ? 0 : programme.price || 0),
    [isVip, programme.price],
  );
  const maxTickets = useMemo(() => (isVip ? VIP_MAX_TICKETS : MAX_TICKETS), [isVip]);

  const chosenAddOns = useMemo(
    () => (programme.addOns ?? []).filter((a) => addOnIds.includes(a.id)),
    [programme.addOns, addOnIds],
  );

  const addOnsPrice = useMemo(
    () => chosenAddOns.reduce((sum, a) => sum + (isVip ? 0 : a.price), 0),
    [chosenAddOns, isVip],
  );

  const total = useMemo(
    () => (effectivePrice + addOnsPrice) * quantity,
    [effectivePrice, addOnsPrice, quantity],
  );

  const chosenSlot = useMemo(
    () => (programme.slots?.length ? (programme.slots[slotIndex] ?? null) : null),
    [programme.slots, slotIndex],
  );

  const chosenDate = useMemo(
    () => (chosenSlot ? `${chosenSlot.day} Dec` : "Date TBA"),
    [chosenSlot],
  );

  const chosenTime = useMemo(
    () => (chosenSlot ? formatTimeRange(chosenSlot) : "Time TBA"),
    [chosenSlot],
  );

  const cartId = useMemo(
    () =>
      chosenSlot
        ? `${programme.id}-${chosenSlot.day}-${chosenSlot.time}`
        : `${programme.id}-unscheduled`,
    [programme.id, chosenSlot],
  );

  const hasLongBlurb = !!programme.longBlurb;

  // Related and parent programmes
  const related = useMemo(
    () => findRelatedProgrammes(programme, allProgrammes, RELATED_LIMIT),
    [programme, allProgrammes],
  );

  const parent = useMemo(
    () => allProgrammes.find((x) => x.includes?.some((i) => i.refId === String(programme.id))),
    [allProgrammes, programme.id],
  );

  // Scroll to add box when intent is cart
  useEffect(() => {
    if (intent !== "cart" || isClosing) return;
    const timer = setTimeout(() => {
      if (isMountedRef.current && addBoxRef.current) {
        addBoxRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, SCROLL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [intent, isClosing]);

  // ===== Handlers =====
  const handleQuantityDecrease = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleQuantityIncrease = useCallback(() => {
    setQuantity((prev) => Math.min(maxTickets, prev + 1));
  }, [maxTickets]);

  const handleToggleAddOn = useCallback((id: string) => {
    setAddOnIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  }, []);

  const findClash = useCallback(() => {
    if (programme.category === "Exhibition") return null;
    if (items.some((i) => i.id === cartId)) return null;
    if (!chosenSlot) return null;

    const chosenDay = chosenSlot.day;
    const chosenStart = chosenSlot.time;

    const slotOf = (id: string) => {
      const match = id.match(/-(\d{1,2})-(\d{2}:\d{2})$/);
      return match ? { day: Number(match[1]), time: match[2] } : null;
    };

    const conflictingItem = [...bookings, ...items].find((item) => {
      if (item.id === cartId) return false;
      const slot = slotOf(item.id);
      return !!slot && slot.day === chosenDay && slot.time === chosenStart;
    });

    return conflictingItem ?? null;
  }, [programme.category, items, cartId, chosenSlot, bookings]);

  const doAddToCart = useCallback(() => {
    add(
      {
        id: cartId,
        title: programme.title,
        venue: programme.venue || "Venue TBA",
        date: chosenDate,
        time: chosenTime,
        price: effectivePrice,
        img: programme.img || PLACEHOLDER_IMAGE,
      },
      quantity,
    );

    // Add add-ons
    for (const addOn of chosenAddOns) {
      add(
        {
          id: `${programme.id}-${addOn.id}-${addOn.day}-${addOn.time}`,
          title: addOn.title,
          venue: programme.venue || "Venue TBA",
          date: `${addOn.day} Dec`,
          time: formatTimeRange({ day: addOn.day, time: addOn.time }),
          price: isVip ? 0 : addOn.price,
          img: programme.img || PLACEHOLDER_IMAGE,
        },
        quantity,
      );
    }
  }, [
    add,
    cartId,
    programme,
    chosenDate,
    chosenTime,
    effectivePrice,
    quantity,
    chosenAddOns,
    isVip,
  ]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    // Small delay to allow animation to play
    setTimeout(() => {
      if (isMountedRef.current) {
        onClose();
        setIsClosing(false);
      }
    }, ANIMATION_DURATION_MS);
  }, [onClose, isClosing]);

  const handleAddToCart = useCallback(() => {
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

    doAddToCart();
    handleClose();
    router.push(`/cart/added?id=${encodeURIComponent(cartId)}`);
  }, [findClash, isAuthenticated, doAddToCart, handleClose, router, cartId]);

  const handleProceedWithClash = useCallback(() => {
    setClashItem(null);
    if (!isAuthenticated) {
      setShowRegisterGate(true);
      return;
    }
    doAddToCart();
    handleClose();
    router.push(`/cart/added?id=${encodeURIComponent(cartId)}`);
  }, [isAuthenticated, doAddToCart, handleClose, router, cartId]);

  const handleOpenRelated = useCallback(
    (relatedProgramme: UIProgramme) => {
      setSlotIndex(0);
      setIsExpanded(false);
      onOpen(relatedProgramme);
    },
    [onOpen],
  );

  // ===== Render helpers =====
  const renderScheduleSelector = () => {
    if (!programme.slots?.length) {
      return (
        <div className="mb-6 border border-foreground p-4">
          <p className="label text-muted-foreground">Schedule</p>
          <p className="mt-2 headline text-sm text-muted-foreground">
            Date and time will be announced.
          </p>
        </div>
      );
    }

    return (
      <>
        <label className="label text-muted-foreground">Select a date & time</label>
        <div className="mt-3 mb-6 flex flex-wrap gap-2">
          {programme.slots.map((slot, index) => (
            <button
              key={`${slot.day}-${slot.time}`}
              onClick={() => setSlotIndex(index)}
              className={`headline text-xs uppercase tracking-[0.06em] border px-3 py-2 transition-colors ${
                slotIndex === index
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {formatSlot(slot)}
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderIncludedProgrammes = () => {
    if (!programme.includes?.length) return null;

    return (
      <div className="mb-6 border border-foreground p-3 md:p-4">
        <p className="label text-muted-foreground">
          Included in this booking — {programme.includes.length} programmes
        </p>
        <ul className="mt-3 divide-y divide-rule">
          {programme.includes.map((inc) => {
            const ref = allProgrammes.find((p) => String(p.id) === inc.refId);
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
                        src={ref.img || PLACEHOLDER_IMAGE}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  <span className="flex-1 flex flex-wrap items-baseline justify-between gap-2">
                    <span className="headline text-sm group-hover:underline underline-offset-4">
                      {inc.title}
                    </span>
                    <span className="headline text-xs text-muted-foreground">
                      {formatTime(inc.time)}
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
    );
  };

  const renderAddOns = () => {
    if (!programme.addOns?.length) return null;

    return (
      <div className="mb-6 border border-foreground p-3 md:p-4">
        <p className="label text-muted-foreground">Extended programming — optional</p>
        <div className="mt-3 space-y-3">
          {programme.addOns.map((addOn) => {
            const isSelected = addOnIds.includes(addOn.id);
            const ref = allProgrammes.find((p) => String(p.id) === addOn.id);
            const priceLabel = isVip || addOn.price === 0 ? "Free" : `₹${addOn.price}`;

            return (
              <div
                key={addOn.id}
                className="border border-foreground p-3 flex flex-col sm:flex-row gap-3"
              >
                <Image
                  src={ref?.img ?? programme.img ?? PLACEHOLDER_IMAGE}
                  alt={addOn.title}
                  width={112}
                  height={112}
                  className="w-full sm:w-28 h-28 object-cover border border-foreground shrink-0"
                  onError={handleImageError}
                />
                <div className="flex-1 min-w-0">
                  <p className="headline text-sm leading-tight">{addOn.title}</p>
                  <p className="mt-1 headline text-xs text-muted-foreground">
                    {addOn.day} Dec · {formatTimeRange({ day: addOn.day, time: addOn.time })} ·{" "}
                    {addOn.category}
                  </p>
                  {addOn.blurb && (
                    <p className="mt-2 headline text-xs text-muted-foreground">{addOn.blurb}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="display text-2xl leading-none">{priceLabel}</span>
                    <button
                      onClick={() => handleToggleAddOn(addOn.id)}
                      aria-pressed={isSelected}
                      className={`headline text-xs uppercase tracking-[0.08em] border border-foreground px-5 py-2.5 transition-colors ${
                        isSelected
                          ? "bg-foreground text-background"
                          : "hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {isSelected ? "Added ✓" : "Add to cart"}
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
    );
  };

  const renderBookingActions = () => {
    if (parent) {
      return (
        <div className="border border-foreground p-4">
          <p className="label text-muted-foreground">Part of a day booking</p>
          <p className="mt-2 headline text-sm">
            This programme can&apos;t be booked on its own — it&apos;s included in{" "}
            <span className="text-foreground font-semibold">{parent.title}</span>. Book the day and
            this is yours.
          </p>
          <button
            onClick={() => onOpen(parent)}
            className="mt-4 headline uppercase tracking-[0.06em] text-sm md:text-base bg-foreground text-background rounded-full px-6 py-3 hover:bg-accent transition-colors"
          >
            Book {parent.title} →
          </button>
        </div>
      );
    }

    return (
      <>
        <label className="label text-muted-foreground">Tickets</label>
        <div className="mt-2 flex items-center gap-6">
          <button
            onClick={handleQuantityDecrease}
            className="display text-3xl w-10"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="display text-4xl tabular-nums w-10 text-center">{quantity}</span>
          <button
            onClick={handleQuantityIncrease}
            className="display text-3xl w-10"
            aria-label="Increase quantity"
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
    );
  };

  // ===== Render =====
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
        {/* Header */}
        <div className="flex items-center justify-between rule-b pb-4">
          <p className="label">Booking</p>
          <button onClick={handleClose} className="label hover:text-accent">
            Close &nbsp;×
          </button>
        </div>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Image */}
          <div className="md:col-span-6">
            <div className="relative w-full aspect-square">
              <Image
                src={programme.img || PLACEHOLDER_IMAGE}
                alt={programme.title || "Programme"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-6">
            <p className="label text-muted-foreground">{programme.category || "Uncategorized"}</p>
            <h2 className="mt-3 display uppercase text-3xl md:text-6xl leading-[0.95] tracking-[-0.02em]">
              {programme.title || "Untitled"}
            </h2>

            {/* About */}
            <section className="mt-4 border border-rule p-4 md:p-5">
              <p className="label text-muted-foreground mb-3">About</p>
              <div className="max-w-prose text-base leading-relaxed headline">
                <p
                  className={
                    hasLongBlurb && !isExpanded
                      ? "line-clamp-4 text-muted-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {isExpanded && hasLongBlurb
                    ? programme.longBlurb
                    : programme.blurb || "No description available"}
                </p>
                {hasLongBlurb && (
                  <button
                    onClick={handleToggleExpanded}
                    className="mt-3 label text-accent hover:underline underline-offset-4"
                  >
                    {isExpanded ? "Read less −" : "Read more +"}
                  </button>
                )}
              </div>
            </section>

            {/* Details Grid */}
            <dl className="mt-6 md:mt-8 grid grid-cols-2 gap-y-3 text-sm rule-t rule-b py-4 headline">
              <dt className="label text-muted-foreground">Curator</dt>
              <dd>{programme.curator || "TBA"}</dd>
              <dt className="label text-muted-foreground">Date</dt>
              <dd>{getDateLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Time</dt>
              <dd>{getTimeLabel(programme)}</dd>
              <dt className="label text-muted-foreground">Venue</dt>
              <dd>{programme.venue || "Venue TBA"}</dd>
              <dt className="label text-muted-foreground">Price</dt>
              <dd>
                {effectivePrice === 0
                  ? isVip && programme.price && programme.price > 0
                    ? "Complimentary — Special guest"
                    : "Free"
                  : `₹${effectivePrice} per ticket`}
              </dd>
            </dl>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(programme.tags || []).map((tag) => (
                <span key={tag} className="label px-2 py-1" style={tagStyle(tag)}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Booking Section */}
            <section
              ref={addBoxRef}
              className={`mt-8 border p-4 md:p-5 ${intent === "cart" ? "border-accent" : "border-foreground"}`}
            >
              {renderScheduleSelector()}
              {renderIncludedProgrammes()}
              {renderAddOns()}
              {renderBookingActions()}
            </section>
          </div>
        </div>

        {/* Related Programmes */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24 rule-t pt-10">
            <h3 className="display uppercase text-2xl md:text-4xl leading-none">
              You might also like
            </h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 items-start">
              {related.map((relatedProgramme) => (
                <ProgrammeCard
                  key={relatedProgramme.id}
                  programme={relatedProgramme}
                  onAbout={() => handleOpenRelated(relatedProgramme)}
                  onAdd={() => handleOpenRelated(relatedProgramme)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
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
            You&apos;ve already booked something at this time.
          </h3>
          <p className="mt-4 text-muted-foreground headline">
            <span className="text-foreground">{clashItem.title}</span> — {clashItem.date} at{" "}
            {clashItem.time}. You can&apos;t be in two places at once — but you can book both if
            you&apos;d like.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleProceedWithClash}
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

      {showRegisterGate && (
        <Modal onClose={() => setShowRegisterGate(false)} label="Registration required">
          <h3 className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
            Complete your registration first.
          </h3>
          <p className="mt-4 text-muted-foreground headline max-w-prose">
            Booking programmes is limited to registered visitors. It&apos;s free and takes a minute
            — you&apos;ll come right back to this programme after.
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
