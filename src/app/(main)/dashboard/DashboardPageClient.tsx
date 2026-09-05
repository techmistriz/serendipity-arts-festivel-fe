"use client";

import Link from "next/link";

import { ListRowsLoadingSkeleton } from "@/components/common/LoadingSkeletons";
import { useCart } from "@/hooks/use-cart";

import { DashboardShell } from "./DashboardShell";
import { formatBookingTime } from "./helpers";

export function DashboardPageClient() {
  return (
    <DashboardShell>
      <BookingsContent />
    </DashboardShell>
  );
}

function BookingsContent() {
  const { bookings, error, loading } = useCart();

  if (loading && bookings.length === 0) {
    return <ListRowsLoadingSkeleton label="Loading bookings" />;
  }

  if (error && bookings.length === 0) {
    return <ErrorMessage message={error} />;
  }

  if (bookings.length === 0) {
    return (
      <p className="label py-16 text-center text-muted-foreground">
        No bookings yet. Browse{" "}
        <Link href="/programmes" className="text-foreground underline underline-offset-4">
          programmes
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="rule-t">
      {bookings.map((booking) => (
        <li key={booking.id} className="rule-b grid grid-cols-12 items-baseline gap-4 py-6">
          <p className="col-span-3 label tabular-nums">{booking.date}</p>
          <div className="col-span-6 md:col-span-5">
            <p className="headline text-xl font-semibold leading-tight md:text-2xl">
              {booking.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatBookingTime(booking.time)} · {booking.venue}
            </p>
          </div>
          <p className="col-span-2 label text-muted-foreground">
            {booking.qty} ticket{booking.qty > 1 ? "s" : ""}
          </p>
          <p className="col-span-3 label md:col-span-2">
            {booking.price === 0 ? "Free" : `₹${booking.price * booking.qty}`}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return <p className="label py-16 text-center text-destructive">{message}</p>;
}
