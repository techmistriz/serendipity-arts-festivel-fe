// import { PROGRAMMES } from "@/data/programmes-data";
// import { CURATORS } from "@/data/curators";

import { CURATORS } from "../data/curators";
import { PROGRAMMES } from "../data/programmes-data";

export type SearchHit = {
  kind: "Page" | "Venue" | "Curator" | "Programme";
  title: string;
  subtitle?: string;
  href: string;
};

const PAGES: SearchHit[] = [
  { kind: "Page", title: "Home", href: "/" },
  { kind: "Page", title: "Programmes", href: "/programmes" },
  { kind: "Page", title: "Curators", href: "/curators" },
  { kind: "Page", title: "Venues", href: "/venues" },
  { kind: "Page", title: "About us", href: "/about" },
  { kind: "Page", title: "Cart", href: "/cart" },
  { kind: "Page", title: "Register", href: "/register" },
  { kind: "Page", title: "Login", href: "/login" },
  { kind: "Page", title: "Dashboard", href: "/dashboard" },
  { kind: "Page", title: "Volunteer", href: "/volunteer" },
  { kind: "Page", title: "FAQ", href: "/faq" },
  { kind: "Page", title: "Contact", href: "/contact" },
  { kind: "Page", title: "Privacy", href: "/privacy" },
  { kind: "Page", title: "Terms & Conditions", href: "/terms" },
  { kind: "Page", title: "Recommend programmes for me", href: "/recommend" },
];

const CURATOR_HITS = CURATORS.map((c) => ({
  kind: "Curator" as const,
  title: c.name,
  subtitle: c.discipline,
  href: "/curators",
}));

const PROGRAMME_HITS = PROGRAMMES.map((p) => ({
  kind: "Programme" as const,
  title: p.title,
  subtitle: `${p.category} • ${p.venue}`,
  href: "/programmes",
}));

const INDEX = [...PAGES, ...CURATOR_HITS, ...PROGRAMME_HITS];

export function searchSite(query: string, limit = 20) {
  const q = query.toLowerCase().trim();

  if (!q) return [];

  return INDEX.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q),
  ).slice(0, limit);
}
