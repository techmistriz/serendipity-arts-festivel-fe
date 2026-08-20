"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { HeaderMenu } from "./_components/HeaderMenu";
import { HeaderSearch } from "./_components/HeaderSearch";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasScrolledPastHero, setHasScrolledPastHero] = useState(false);
  const isHomePage = pathname === "/";
  const isOverlayOpen = isMenuOpen || isSearchOpen;

  useEffect(() => {
    const updateScrolledState = () => {
      const nextValue = window.scrollY > 240;

      setHasScrolledPastHero((currentValue) =>
        currentValue === nextValue ? currentValue : nextValue,
      );
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

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

  return (
    <>
      <header className="rule-b sticky top-0 z-40 bg-background/85 backdrop-blur-sm">
        <div className="container-editorial flex h-14 items-center justify-between md:h-16">
          <Link
            href="/"
            aria-label="Home"
            className="label notch transition-colors hover:text-accent"
          >
            Home
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              aria-expanded={isSearchOpen}
              className="transition-colors hover:text-accent"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {(!isHomePage || hasScrolledPastHero) && (
              <Link
                href="/register"
                className="label notch rounded-full bg-foreground px-4 py-2 text-background transition-colors hover:bg-accent"
              >
                Register
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              className="label notch flex items-center gap-2 transition-colors hover:text-accent"
            >
              <span className="hidden sm:inline">Menu</span>
              <span aria-hidden className="inline-flex flex-col gap-[3px]">
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
