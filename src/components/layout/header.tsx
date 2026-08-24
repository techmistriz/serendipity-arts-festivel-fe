"use client";

import { LayoutGrid, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { HeaderMenu } from "./_components/HeaderMenu";
import { HeaderSearch } from "./_components/HeaderSearch";

import { useCart } from "@/hooks/use-cart";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSession } from "@/redux/slices/authSlice";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);

  // Cart is responsible only for cart state.
  const { count } = useCart();

  // Auth is responsible only for authentication state.
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const isHomePage = pathname === "/";
  const isOverlayOpen = isMenuOpen || isSearchOpen;

  /**
   * Scroll state
   */
  useEffect(() => {
    const updateScrolledState = () => {
      const nextValue = window.scrollY > 240;

      setHasScrolledPastHero((currentValue) =>
        currentValue === nextValue ? currentValue : nextValue,
      );
    };

    updateScrolledState();

    window.addEventListener("scroll", updateScrolledState, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  /**
   * Prevent body scrolling while menu/search overlay is open.
   */
  useEffect(() => {
    if (!isOverlayOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOverlayOpen]);

  /**
   * Logout
   *
   * clearSession() resets:
   * - session
   * - user
   * - accessToken
   * - isAuthenticated
   *
   * Your API logout request can also be added here if your
   * backend requires an explicit /auth/logout call.
   */
  const handleLogout = () => {
    dispatch(clearSession());
    router.replace("/");
  };

  return (
    <>
      <header className="rule-b sticky top-0 z-40 bg-background/85 backdrop-blur-sm">
        <div className="container-editorial flex h-14 items-center justify-between md:h-16">
          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            className="label notch transition-colors hover:text-accent"
          >
            Home
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Search */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              aria-expanded={isSearchOpen}
              className="transition-colors hover:text-accent"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {/* Dashboard */}

            <Link
              href="/dashboard"
              aria-label="Dashboard"
              className="relative transition-colors hover:text-accent"
            >
              <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative transition-colors hover:text-accent"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />

              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold tabular-nums text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>

            {/* Authentication */}
            {!loading && (
              <>
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="label notch transition-colors hover:text-accent"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="label notch transition-colors hover:text-accent">
                      Login
                    </Link>
                  </>
                )}
              </>
            )}

            {(!isHomePage || hasScrolledPastHero) && (
              <Link
                href="/register"
                className="label notch rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-accent"
              >
                Register
              </Link>
            )}

            {/* Menu */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="label notch flex items-center gap-2 transition-colors hover:text-accent"
            >
              <span className="hidden sm:inline">Menu</span>

              <span aria-hidden="true" className="inline-flex flex-col gap-[3px]">
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {isSearchOpen && <HeaderSearch onClose={() => setIsSearchOpen(false)} />}

      {isMenuOpen && <HeaderMenu onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}
