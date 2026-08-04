import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, LayoutGrid, Search } from "lucide-react";
import { useCart } from "@/lib/cart";
import { searchSite } from "@/lib/site-search";

const MENU: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Programmes", to: "/programmes" },
  { label: "Curators", to: "/curators" },
  { label: "Venues", to: "/venues" },
  { label: "About us", to: "/about" },
  { label: "Cart", to: "/cart" },
  { label: "Register", to: "/register" },
  { label: "Login", to: "/login" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Volunteer", to: "/volunteer" },
  { label: "SEA", to: "/sea" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },

];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { count, isLoggedIn, logout, justBooked, clearJustBooked } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const navigate = useNavigate();

  // Clear the "just booked" highlight once the user opens the dashboard
  useEffect(() => {
    if (pathname === "/dashboard" && justBooked) clearJustBooked();
  }, [pathname, justBooked, clearJustBooked]);

  useEffect(() => {
    document.body.style.overflow = (open || searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => searchSite(q, 24), [q]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-sm rule-b">
        <div className="container-editorial flex h-14 md:h-16 items-center justify-between">
          <Link to="/" aria-label="Home" className="label notch hover:text-accent transition-colors">
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
            <Link to="/dashboard" aria-label="Dashboard"
              className="relative hover:text-accent transition-colors">
              <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <Link to="/cart" aria-label="Cart"
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
                <Link to="/login" className="label notch hover:text-accent transition-colors">
                  Login
                </Link>
                {!isHome && (
                  <Link to="/register"
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
                {results.length === 0 && (
                  <li className="py-6 text-sm text-muted-foreground">
                    {q ? "Nothing matches that yet." : "Try \u201cdance\u201d, \u201cArt Park\u201d, \u201cvolunteer\u201d\u2026"}
                  </li>
                )}
                {results.map((h, i) => (
                  <li key={`${h.kind}-${h.title}-${i}`} className="rule-b">
                    <button
                      onClick={() => {
                        setSearchOpen(false); setQ("");
                        navigate({ to: h.to, search: (h.search ?? {}) as never });
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
            <Link to="/" onClick={() => setOpen(false)} className="label notch hover:text-accent">
              Home
            </Link>
            <button onClick={() => setOpen(false)} className="label notch hover:text-accent transition-colors" aria-label="Close menu">
              Close &nbsp; &times;
            </button>
          </div>
          <nav className="container-editorial pt-8 pb-16 md:pt-16">
            <ul>
              {MENU.map((m) => (
                <li key={m.to} className="rule-b">
                  <Link to={m.to} onClick={() => setOpen(false)} className="group flex items-baseline justify-between py-4 md:py-7">
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
