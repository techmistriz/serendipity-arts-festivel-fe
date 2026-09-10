"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatSlotDate } from "@/utils/date";

export type ScheduleSlot = {
  eventDate?: string | null;
  fromTime?: string | null;
  toTime?: string | null;
};

type ScheduleMarqueeProps = {
  slots?: ScheduleSlot[];
  venue?: string | null;
  className?: string;
  speedPerItem?: number;
  minDuration?: number;
};

export function ScheduleMarquee({
  slots = [],
  venue,
  className = "",
  speedPerItem = 8,
  minDuration = 25,
}: ScheduleMarqueeProps) {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const formatTime = useCallback((time?: string | null) => {
    if (!time) return "TBA";

    const [h, m] = time.split(":").map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) {
      return "TBA";
    }

    const period = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;

    return `${hh}:${m.toString().padStart(2, "0")} ${period}`;
  }, []);

  const marqueeDuration = useMemo(() => {
    return Math.max(minDuration, slots.length * speedPerItem);
  }, [slots.length, speedPerItem, minDuration]);

  useEffect(() => {
    const element = scheduleRef.current;

    if (!element) return;

    const checkOverflow = () => {
      setHasOverflow(element.scrollWidth > element.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [slots]);

  if (!slots.length) {
    return venue ? (
      <div
        className={`headline overflow-hidden whitespace-nowrap text-[11px] text-muted-foreground md:text-xs ${className}`}
      >
        {venue}
      </div>
    ) : null;
  }

  const renderSlots = (prefix: string) =>
    slots.map((slot, index) => (
      <span
        key={`${prefix}-${slot.eventDate}-${slot.fromTime}-${slot.toTime}-${index}`}
        className="mr-4 inline-block shrink-0"
      >
        {formatSlotDate(slot.eventDate)} · {formatTime(slot.fromTime)} - {formatTime(slot.toTime)}
        {venue && ` · ${venue}`}
      </span>
    ));

  return (
    <div
      ref={scheduleRef}
      className={`headline overflow-hidden whitespace-nowrap text-[11px] text-muted-foreground md:text-xs ${className}`}
    >
      <div
        className={`schedule-marquee-track ${hasOverflow ? "is-animating" : ""}`}
        style={
          {
            "--marquee-duration": `${marqueeDuration}s`,
          } as React.CSSProperties
        }
      >
        {renderSlots("primary")}

        {hasOverflow && renderSlots("duplicate")}

        {hasOverflow && renderSlots("duplicate-2")}
      </div>
    </div>
  );
}
