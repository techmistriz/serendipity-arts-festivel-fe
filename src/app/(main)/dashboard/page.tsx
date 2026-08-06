"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutUser } from "@/src/store/slices/authThunk";
import { useRouter } from "next/navigation";

const DAY_NAME = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayName = (d: number) => DAY_NAME[(d - 13 + 0) % 7];

function fmtAmPm(t: string) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(t.trim());
    if (!m) return t;
    const h = parseInt(m[1], 10);
    const period = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${m[2]} ${period}`;
}

export default function DashboardPage() {
    const [tab, setTab] = useState<"bookings" | "wishlist" | "schedule" | "profile">("bookings");
    const [deleteStep, setDeleteStep] = useState<null | "confirm" | "comms" | "done">(null);
    const [comms, setComms] = useState(true);

    // Sample data for UI display
    const bookings = [
        { id: "1", title: "Opening Ceremony", venue: "Main Stage", dates: [13, 14], time: "7:30 PM", qty: 2, price: 0 },
        { id: "2", title: "Classical Dance Workshop", venue: "Studio A", dates: [15], time: "10:00 AM", qty: 1, price: 500 },
        { id: "3", title: "Artist Talk: Contemporary Art", venue: "Gallery Hall", dates: [16, 17], time: "3:00 PM", qty: 1, price: 0 },
    ];

    const wishlistItems = [
        { id: "w1", title: "Theatre Performance", category: "Theatre", img: "/placeholder.jpg", venue: "Main Stage", date: "15 Dec", time: "7:30 PM" },
        { id: "w2", title: "Music Concert", category: "Music", img: "/placeholder.jpg", venue: "Open Air", date: "16 Dec", time: "8:00 PM" },
    ];

    const totalTickets = bookings.reduce((s, b) => s + b.qty, 0);
    const venuesCovered = new Set(bookings.map((b) => b.venue)).size;


    const router = useRouter();
   const dispatch = useAppDispatch();

const { user, isAuthenticated } = useAppSelector(
  (state) => state.auth
);

const isLoggedIn = isAuthenticated;

const handleLogout = async () => {
  await dispatch(logoutUser());
  router.replace("/login");
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
                    To access your dashboard you need to login if already registered, and if not registered already, register and book programmes.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/login" className="label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
                        Log in →
                    </Link>
                    <Link href="/register" className="label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
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
                        className={`display uppercase text-2xl md:text-3xl leading-none transition-colors relative pb-1 ${tab === t ? "text-foreground pink-underline" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="mt-10">
                {tab === "bookings" && (
                    bookings.length === 0 ? (
                        <p className="label text-muted-foreground py-16 text-center">
                            No bookings yet. Browse <Link href="/programmes" className="text-foreground underline underline-offset-4">programmes</Link>.
                        </p>
                    ) : (
                        <ul className="rule-t">
                            {bookings.map((b) => (
                                <li key={b.id} className="rule-b py-6 grid grid-cols-12 gap-4 items-baseline">
                                    <p className="col-span-3 label tabular-nums">
                                        {b.dates.length === 0 ? "—" : b.dates.length === 1 ? `${b.dates[0]} Dec` : `${b.dates.join(", ")} Dec`}
                                    </p>
                                    <div className="col-span-6 md:col-span-5">
                                        <p className="headline font-semibold text-xl md:text-2xl leading-tight">{b.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{fmtAmPm(b.time)} · {b.venue}</p>
                                    </div>
                                    <p className="col-span-2 label text-muted-foreground">{b.qty} ticket{b.qty > 1 ? "s" : ""}</p>
                                    <p className="col-span-3 md:col-span-2 label">{b.price === 0 ? "Free" : `₹${b.price * b.qty}`}</p>
                                </li>
                            ))}
                        </ul>
                    )
                )}

                {tab === "wishlist" && (
                    wishlistItems.length === 0 ? (
                        <p className="label text-muted-foreground py-16 text-center">
                            Nothing saved yet. Browse <Link href="/programmes" className="text-foreground underline underline-offset-4">programmes</Link> and tap the heart to save.
                        </p>
                    ) : (
                        <ul className="rule-t">
                            {wishlistItems.map((p) => (
                                <li key={p.id} className="rule-b py-6 grid grid-cols-12 gap-4 items-center">
                                    <Image src={p.img} alt={p.title} className="col-span-2 md:col-span-1 w-full aspect-square object-cover" />
                                    <div className="col-span-7 md:col-span-8">
                                        <p className="label text-muted-foreground">{p.category}</p>
                                        <p className="headline font-semibold text-lg md:text-xl leading-tight mt-1">{p.title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground headline">{p.date} · {p.time} · {p.venue}</p>
                                    </div>
                                    <div className="col-span-3 flex flex-wrap items-center justify-end gap-2">
                                        <Link href={`/programmes?p=${p.id}`} className="label border border-foreground px-3 py-2 hover:bg-foreground hover:text-background transition-colors">
                                            Book →
                                        </Link>
                                        <button aria-label="Remove from wishlist" className="p-2 hover:text-accent">
                                            <Heart className="h-4 w-4 fill-accent text-accent" strokeWidth={1.75} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                )}

                {tab === "schedule" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
                        {[13, 14, 15, 16, 17, 18, 19, 20].map((d) => {
                            const dayItems = bookings
                                .filter((b) => b.dates.includes(d))
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
                                                <p className="label text-accent tabular-nums">{fmtAmPm(b.time)}</p>
                                                <p className="mt-0.5 leading-tight">{b.title} {b.qty > 1 && <span className="text-muted-foreground">×{b.qty}</span>}</p>
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
                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <Row k="Name" v="Ananya Rao" />
                            <Row k="Email" v="ananya@studio.in" />
                            <Row k="WhatsApp" v="+91 98••• ••432" />
                            <Row k="City" v="Panjim, Goa" />
                            <Row k="Interests" v="Visual Arts · Music · Craft" />
                            <Row k="Member since" v="2023" />
                        </dl>

                        {/* Data & privacy */}
                        <div className="mt-12 border border-foreground p-5 md:p-8">
                            <p className="label text-muted-foreground">Data &amp; privacy</p>
                            <h3 className="mt-2 display uppercase text-2xl md:text-3xl leading-[1]">
                                Delete my information once the festival is over
                            </h3>
                            <p className="mt-3 headline text-sm md:text-base text-muted-foreground max-w-prose">
                                If you keep your information with us, we'll use it next year to pre-fill your
                                registration so you can book in seconds. Delete it and you'll start from scratch
                                in 2027 — your past bookings and preferences will be permanently removed after
                                the festival closes on 20 December.
                            </p>
                            <button
                                onClick={() => setDeleteStep("confirm")}
                                className="mt-6 label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
                            >
                                Delete my information →
                            </button>
                        </div>
                    </div>
                )}

                {deleteStep && (
                    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-foreground/70" onClick={() => setDeleteStep(null)} aria-hidden />
                        <div className="relative w-full max-w-lg bg-background border border-foreground p-6 md:p-8">
                            {deleteStep === "confirm" && (
                                <>
                                    <h3 className="display uppercase text-2xl md:text-3xl leading-[1]">
                                        Delete after the festival?
                                    </h3>
                                    <p className="mt-4 headline text-sm md:text-base text-muted-foreground">
                                        Heads up — we normally keep your details so next year's registration is
                                        quick-filled for you. Deleting means re-entering everything in 2027.
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setDeleteStep("comms")}
                                            className="label bg-foreground text-background px-5 py-3 hover:bg-accent transition-colors"
                                        >
                                            Yes, delete it →
                                        </button>
                                        <button
                                            onClick={() => setDeleteStep(null)}
                                            className="label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
                                        >
                                            Keep my information
                                        </button>
                                    </div>
                                </>
                            )}
                            {deleteStep === "comms" && (
                                <>
                                    <h3 className="display uppercase text-2xl md:text-3xl leading-[1]">
                                        One last thing.
                                    </h3>
                                    <p className="mt-4 headline text-sm md:text-base text-muted-foreground">
                                        Would you still like to receive communication from Serendipity Arts —
                                        programme announcements, grants and open calls?
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => { setComms(true); setDeleteStep("done"); }}
                                            className="label bg-foreground text-background px-5 py-3 hover:bg-accent transition-colors"
                                        >
                                            Yes, keep me posted
                                        </button>
                                        <button
                                            onClick={() => { setComms(false); setDeleteStep("done"); }}
                                            className="label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
                                        >
                                            No, unsubscribe me
                                        </button>
                                    </div>
                                </>
                            )}
                            {deleteStep === "done" && (
                                <>
                                    <h3 className="display uppercase text-2xl md:text-3xl leading-[1]">
                                        Noted.
                                    </h3>
                                    <p className="mt-4 headline text-sm md:text-base text-muted-foreground">
                                        Your information will be deleted after 20 December 2026.{" "}
                                        {comms
                                            ? "We'll still send you news from Serendipity Arts."
                                            : "You won't hear from us again."}{" "}
                                        You can change your mind any time before the festival ends.
                                    </p>
                                    <button
                                        onClick={() => setDeleteStep(null)}
                                        className="mt-8 label border border-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-colors"
                                    >
                                        Close
                                    </button>
                                </>
                            )}
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

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="rule-b pb-3">
            <p className="label text-muted-foreground">{k}</p>
            <p className="mt-1">{v}</p>
        </div>
    );
}