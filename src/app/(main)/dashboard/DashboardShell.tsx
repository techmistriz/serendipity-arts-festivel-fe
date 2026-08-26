"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAppDispatch } from "@/redux/hooks";
import { clearSession } from "@/redux/slices/authSlice";
import { authService } from "@/services/auth.service";

const dashboardLinks = [
  { href: "/dashboard", label: "Bookings" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/schedule", label: "Schedule" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

export function DashboardShell({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { bookings } = useCart();
  const { total: wishlistTotal } = useWishlist();

  const totalTickets = bookings.reduce((total, booking) => total + booking.qty, 0);
  const venuesCovered = new Set(bookings.map((booking) => booking.venue)).size;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch(clearSession());
      router.replace("/login");
    }
  };

  if (!isAuthenticated) {
    return <DashboardLoginPrompt />;
  }

  return (
    <div className="container-editorial pt-16 pb-32 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-muted-foreground">Welcome back</p>
          <h1 className="mt-2 display text-[14vw] leading-[0.9] uppercase md:text-[9vw]">
            {user?.name || "Guest"}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="label border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Sign out
        </button>
      </div>

      <div className="rule-t rule-b mt-16 grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
        <Stat value={String(bookings.length).padStart(2, "0")} label="Bookings" />
        <Stat value={String(totalTickets).padStart(2, "0")} label="Tickets" />
        <Stat value={String(wishlistTotal).padStart(2, "0")} label="Wishlist" />
        <Stat value={String(venuesCovered).padStart(2, "0")} label="Venues covered" />
      </div>

      <nav aria-label="Dashboard sections" className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
        {dashboardLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`display relative pb-1 text-2xl leading-none uppercase transition-colors md:text-3xl ${
                isActive
                  ? "pink-underline text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {link.href === "/dashboard/wishlist" && wishlistTotal > 0 && (
                <span className="ml-2 text-sm text-accent">({wishlistTotal})</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10">{children}</div>
    </div>
  );
}

function DashboardLoginPrompt() {
  return (
    <div className="container-editorial pt-16 pb-40 md:pt-24">
      <h1 className="display text-[13vw] leading-[0.9] uppercase md:text-[8vw]">Dashboard.</h1>
      <p className="headline mt-8 max-w-xl text-lg text-muted-foreground">
        To access your dashboard, log in if you have already registered. Otherwise, register and
        book programmes.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/login"
          className="label border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Log in →
        </Link>
        <Link
          href="/register"
          className="label border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Register →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="display text-4xl leading-none tabular-nums md:text-6xl">{value}</p>
      <p className="mt-2 label text-muted-foreground">{label}</p>
    </div>
  );
}
