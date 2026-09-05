"use client";

import { useCart } from "@/hooks/use-cart";

import { DashboardShell } from "./DashboardShell";
import { formatBookingTime, getFestivalDay } from "./helpers";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleDashboardPageClient() {
  return (
    <DashboardShell>
      <ScheduleContent />
    </DashboardShell>
  );
}

function ScheduleContent() {
  const { bookings } = useCart();

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-8">
      {[13, 14, 15, 16, 17, 18, 19, 20].map((day) => {
        const dayItems = bookings
          .filter((booking) => getFestivalDay(booking.date) === day)
          .sort((first, second) => first.time.localeCompare(second.time));

        return (
          <div key={day} className="rule-t min-h-[180px] pt-4">
            <p className="label text-muted-foreground">{dayNames[(day - 13) % dayNames.length]}</p>
            <p className="display text-3xl leading-none tabular-nums md:text-4xl">{day}</p>
            <p className="mt-1 label text-muted-foreground">Dec</p>
            <ul className="mt-4 space-y-3">
              {dayItems.length === 0 && (
                <li className="text-xs italic text-muted-foreground/60">Nothing booked</li>
              )}
              {dayItems.map((booking) => (
                <li key={booking.id} className="border-l-2 border-accent pl-2 text-xs">
                  <p className="label text-accent tabular-nums">
                    {formatBookingTime(booking.time)}
                  </p>
                  <p className="mt-0.5 leading-tight">
                    {booking.title}{" "}
                    {booking.qty > 1 && (
                      <span className="text-muted-foreground">×{booking.qty}</span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-muted-foreground">{booking.venue}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
