"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { clearSession } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";
import { fmtTime, PROGRAMMES } from "@/data/programmes-data";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";

import { formatBookingTime, getFestivalDay } from "./helpers";

const DAY_NAME = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = (day: number) => DAY_NAME[(day - 13) % 7];

export function DashboardPageClient() {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<"bookings" | "wishlist" | "schedule" | "profile">("bookings");
  const { bookings } = useCart();
  const { programmeIds, toggleProgramme } = useWishlist();
  const wishlistItems = programmeIds.flatMap((programmeId) => {
    const programme = PROGRAMMES.find(({ id }) => id === programmeId);

    return programme
      ? [
          {
            id: programme.id,
            title: programme.title,
            category: programme.category,
            img: programme.img,
            venue: programme.venue,
            date: `${programme.slots[0].day} Dec`,
            time: fmtTime(programme.slots[0].time),
          },
        ]
      : [];
  });

  const totalTickets = bookings.reduce((s, b) => s + b.qty, 0);
  const venuesCovered = new Set(bookings.map((b) => b.venue)).size;

  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const isLoggedIn = isAuthenticated;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(clearSession());
      router.replace("/login");
    }
  };

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/login?next=/dashboard");
  //   }
  // }, [isAuthenticated, router]);

  if (!isLoggedIn) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[13vw] md:text-[8vw] leading-[0.9]">Dashboard.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground headline text-lg">
          To access your dashboard you need to login if already registered, and if not registered
          already, register and book programmes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Log in →
          </Link>
          <Link
            href="/register"
            className="label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            Register →
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container-editorial pt-16 md:pt-24 pb-32">
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <p className="label text-muted-foreground">Welcome back</p>
          <h1 className="mt-2 display uppercase text-[14vw] md:text-[9vw] leading-[0.9]">
            {user?.name || "Guest"}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Stat row */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 rule-t rule-b py-8">
        <Stat n={String(bookings.length).padStart(2, "0")} l="Bookings" />
        <Stat n={String(totalTickets).padStart(2, "0")} l="Tickets" />
        <Stat n={String(wishlistItems.length).padStart(2, "0")} l="Wishlist" />
        <Stat n={String(venuesCovered).padStart(2, "0")} l="Venues covered" />
      </div>

      {/* Tabs */}
      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
        {(["bookings", "wishlist", "schedule", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`display uppercase text-2xl md:text-3xl leading-none transition-colors relative pb-1 ${
              tab === t
                ? "text-foreground pink-underline"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "bookings" &&
          (bookings.length === 0 ? (
            <p className="label text-muted-foreground py-16 text-center">
              No bookings yet. Browse{" "}
              <Link href="/programmes" className="text-foreground underline underline-offset-4">
                programmes
              </Link>
              .
            </p>
          ) : (
            <ul className="rule-t">
              {bookings.map((b) => (
                <li key={b.id} className="rule-b py-6 grid grid-cols-12 gap-4 items-baseline">
                  <p className="col-span-3 label tabular-nums">{b.date}</p>
                  <div className="col-span-6 md:col-span-5">
                    <p className="headline font-semibold text-xl md:text-2xl leading-tight">
                      {b.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatBookingTime(b.time)} · {b.venue}
                    </p>
                  </div>
                  <p className="col-span-2 label text-muted-foreground">
                    {b.qty} ticket{b.qty > 1 ? "s" : ""}
                  </p>
                  <p className="col-span-3 md:col-span-2 label">
                    {b.price === 0 ? "Free" : `₹${b.price * b.qty}`}
                  </p>
                </li>
              ))}
            </ul>
          ))}

        {tab === "wishlist" &&
          (wishlistItems.length === 0 ? (
            <p className="label text-muted-foreground py-16 text-center">
              Nothing saved yet. Browse{" "}
              <Link href="/programmes" className="text-foreground underline underline-offset-4">
                programmes
              </Link>{" "}
              and tap the heart to save.
            </p>
          ) : (
            <ul className="rule-t">
              {wishlistItems.map((p) => (
                <li key={p.id} className="rule-b py-6 grid grid-cols-12 gap-4 items-center">
                  <Image
                    src={p.img}
                    alt={p.title}
                    width={200}
                    height={200}
                    className="col-span-2 md:col-span-1 w-full aspect-square object-cover"
                  />
                  <div className="col-span-7 md:col-span-8">
                    <p className="label text-muted-foreground">{p.category}</p>
                    <p className="headline font-semibold text-lg md:text-xl leading-tight mt-1">
                      {p.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground headline">
                      {p.date} · {p.time} · {p.venue}
                    </p>
                  </div>
                  <div className="col-span-3 flex flex-wrap items-center justify-end gap-2">
                    <Link
                      href={`/programmes?p=${p.id}`}
                      className="label border border-foreground px-3 py-2 hover:bg-foreground hover:text-background transition-colors"
                    >
                      Book →
                    </Link>
                    <button
                      onClick={() => toggleProgramme(p.id)}
                      aria-label="Remove from wishlist"
                      className="p-2 hover:text-accent"
                    >
                      <Heart className="h-4 w-4 fill-accent text-accent" strokeWidth={1.75} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {tab === "schedule" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {[13, 14, 15, 16, 17, 18, 19, 20].map((d) => {
              const dayItems = bookings
                .filter((booking) => getFestivalDay(booking.date) === d)
                .sort((a, z) => a.time.localeCompare(z.time));
              return (
                <div key={d} className="rule-t pt-4 min-h-[180px]">
                  <p className="label text-muted-foreground">{dayName(d)}</p>
                  <p className="display text-3xl md:text-4xl tabular-nums leading-none">{d}</p>
                  <p className="label text-muted-foreground mt-1">Dec</p>
                  <ul className="mt-4 space-y-3">
                    {dayItems.length === 0 && (
                      <li className="text-xs text-muted-foreground/60 italic">Nothing booked</li>
                    )}
                    {dayItems.map((b) => (
                      <li key={b.id + d} className="text-xs border-l-2 border-accent pl-2">
                        <p className="label text-accent tabular-nums">
                          {formatBookingTime(b.time)}
                        </p>
                        <p className="mt-0.5 leading-tight">
                          {b.title}{" "}
                          {b.qty > 1 && <span className="text-muted-foreground">×{b.qty}</span>}
                        </p>
                        <p className="text-muted-foreground mt-0.5 truncate">{b.venue}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {tab === "profile" && (
          <div className="max-w-2xl">
            <dl className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
              <Row label="Name" value={user?.name ?? "—"} />
              <Row label="Email" value={user?.email ?? "—"} />
            </dl>

            <div className="mt-12 border border-foreground p-5 md:p-8">
              <p className="label text-muted-foreground">Data &amp; privacy</p>
              <h3 className="mt-2 display uppercase text-2xl md:text-3xl leading-[1]">
                Your privacy matters.
              </h3>
              <p className="mt-3 headline text-sm md:text-base text-muted-foreground max-w-prose">
                Review how Serendipity Arts Festival handles your personal information and your
                available choices.
              </p>
              <Link
                href="/privacy"
                className="label mt-6 inline-block border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
              >
                Read the privacy policy →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="display text-4xl md:text-6xl leading-none tabular-nums">{n}</p>
      <p className="mt-2 label text-muted-foreground">{l}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rule-b pb-3">
      <p className="label text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
