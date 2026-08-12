"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, Search, ShoppingBag } from "lucide-react";

import { searchSiteApi } from "../services/search";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { logoutUser } from "@/src/store/slices/authThunk";

const MENU = [
  { label: "Home", href: "/" },
  { label: "Programmes", href: "/programmes" },
  { label: "Curators", href: "/curators" },
  { label: "Venues", href: "/venues" },
  { label: "About us", href: "/about" },
  { label: "Cart", href: "/cart" },
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Wayfinding", href: "/wayfinding" },
  { label: "Icons", href: "/icons" },
  { label: "SEA", href: "/sea" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];


type SearchResult = {
  kind: "Programme" | "Curator" | "Venue" | "Vibe";
  title: string;
  subtitle?: string;
  href: string;
};


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();


  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(
    (state) => state.auth.isAuthenticated
  );

  const count = 0;

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);


  const isHome = pathname === "/";



  const performSearch = async (keyword: string) => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    try {
      setSearchLoading(true);

      const data = await searchSiteApi(keyword);

      const searchResults: SearchResult[] = [
        ...data.programs.map((program) => ({
          kind: "Programme" as const,
          title: program.name,
          subtitle: "Programme",
          href: `/programmes/${program.slug}`,
        })),

        ...data.curators.map((curator) => ({
          kind: "Curator" as const,
          title: curator.name,
          subtitle: curator.discipline,
          href: curator.slug
            ? `/curators/${curator.slug}`
            : "/curators",
        })),

        ...data.venues.map((venue) => ({
          kind: "Venue" as const,
          title: venue.name,
          subtitle: "Venue",
          href: venue.slug
            ? `/venues/${venue.slug}`
            : "/venues",
        })),

        ...data.vibes.map((vibe) => ({
          kind: "Vibe" as const,
          title: vibe.name,
          subtitle: "Vibe",
          href: `/programmes/`,
        })),
      ];

      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const keyword = q.trim();

    if (!keyword) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(keyword);
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);


 const logout = async () => {
  await dispatch(logoutUser());
  router.push("/");
};

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm rule-b">
        <div className="container-editorial flex h-14 md:h-16 items-center justify-between">

          <Link href="/" aria-label="Home" className="label notch hover:text-accent transition-colors">
            Home
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hover:text-accent transition-colors"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <Link href="/dashboard" aria-label="Dashboard"
              className="relative hover:text-accent transition-colors">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link href="/cart" aria-label="Cart"
              className="relative hover:text-accent transition-colors">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {count}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="label notch hover:text-accent transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="label notch hover:text-accent transition-colors">
                  Login
                </Link>
                {(!isHome || scrolled) && (
                  <Link href="/register"
                    className="label notch bg-foreground text-background rounded-full px-4 py-2 hover:bg-accent transition-colors">
                    Register
                  </Link>
                )}
              </>
            )}
            <button
              onClick={() => setOpen(true)}
              className="label notch flex items-center gap-2 hover:text-accent transition-colors"
              aria-label="Open menu"
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

      {/* Search */}


      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md overflow-y-auto ed-fade">
          <div className="container-editorial pt-6 md:pt-10">
            <div className="flex items-center justify-between rule-b pb-4">
              <p className="label">Search the festival</p>
              <button onClick={() => { setSearchOpen(false); setQ(""); }} className="label notch hover:text-accent">
                Close ×
              </button>
            </div>
            <div className="mt-8 border border-foreground flex items-center gap-3 px-4 md:px-5 py-3">
              <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search programmes, curators, venues…"
                className="flex-1 bg-transparent outline-none text-base md:text-xl headline"
              />
              {q && (
                <button onClick={() => setQ("")} className="label text-muted-foreground hover:text-accent">
                  Clear ×
                </button>
              )}
            </div>

            <div className="mt-10 pb-16">
              <ul className="rule-t">
                {searchLoading && (
                  <li className="py-6 text-sm text-muted-foreground">
                    Searching...
                  </li>
                )}

                {!searchLoading && results.length === 0 && (
                  <li className="py-6 text-sm text-muted-foreground">
                    {q
                      ? "Nothing matches that yet."
                      : "Try “dance”, “Art Park”, “volunteer”…"}
                  </li>
                )}
                {results.map((h, i) => (
                  <li key={`${h.kind}-${h.title}-${i}`} className="rule-b">
                    <button
                      onClick={() => {
                        setSearchOpen(false);
                        setQ("");

                        router.push(h.href);
                      }}
                      className="w-full py-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-left hover:text-accent"
                    >
                      <span className="headline font-semibold text-base md:text-xl">{h.title}</span>
                      <span className="label text-muted-foreground shrink-0">
                        {h.kind}{h.subtitle ? ` \u00b7 ${h.subtitle}` : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-background ed-fade overflow-y-auto">
          <div className="container-editorial flex h-14 md:h-16 items-center justify-between rule-b">
            <Link href="/" onClick={() => setOpen(false)} className="label notch hover:text-accent">
              Home
            </Link>
            <button onClick={() => setOpen(false)} className="label notch hover:text-accent transition-colors" aria-label="Close menu">
              Close &nbsp; &times;
            </button>
          </div>
          <nav className="container-editorial pt-8 pb-16 md:pt-16">
            <ul>
              {MENU.map((m) => (
                <li key={m.href} className="rule-b">
                  <Link
                    href={m.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between py-4 md:py-7"
                  >
                    <span className="display uppercase text-[11vw] md:text-[7vw] leading-[0.95] group-hover:text-accent transition-colors">
                      {m.label}
                    </span>

                    <span className="label text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}