// import { PROGRAMMES } from "@/lib/data/programmes";
// import { CURATORS } from "@/lib/data/programmes";

import { CURATORS } from "../data/curators";
import { PROGRAMMES } from "../data/programmes-data";

export type SearchHit = {
  kind: "Page" | "Venue" | "Curator" | "Programme";
  title: string;
  subtitle?: string;
  to: string;
  search?: Record<string, string>;
};

const PAGES: SearchHit[] = [
  { kind: "Page", title: "Home", to: "/" },
  { kind: "Page", title: "Programmes", to: "/programmes" },
  { kind: "Page", title: "Curators", to: "/curators" },
  { kind: "Page", title: "Venues", to: "/venues" },
  { kind: "Page", title: "About us", to: "/about" },
  { kind: "Page", title: "Cart", to: "/cart" },
  { kind: "Page", title: "Register", to: "/register" },
  { kind: "Page", title: "Login", to: "/login" },
  { kind: "Page", title: "Dashboard", to: "/dashboard" },
  { kind: "Page", title: "Volunteer", to: "/volunteer" },
  { kind: "Page", title: "FAQ", to: "/faq" },
  { kind: "Page", title: "Contact", to: "/contact" },
  { kind: "Page", title: "Privacy", to: "/privacy" },
  { kind: "Page", title: "Terms & Conditions", to: "/terms" },
  { kind: "Page", title: "Recommend programmes for me", to: "/recommend" },
];

const VENUES: { name: string; subVenues: string[] }[] = [
  { 
    name: "The Old GMC Complex", 
    subVenues: ["Ground Floor Galleries", "First Floor Wing", "Central Courtyard", "Second Floor Wing"] 
  },
  { 
    name: "Art Park", 
    subVenues: ["Main Lawn", "Culinary Pavilion", "Workshop Tent", "Shopping Village"] 
  },
  { 
    name: "Promenade", 
    subVenues: ["North Deck", "Central Bandstand", "South Deck"] 
  },
  { 
    name: "Samba Square", 
    subVenues: ["Central Stage", "Shaded Pavilion"] 
  },
  { 
    name: "Arena at DB Ground", 
    subVenues: ["Main Arena", "Backstage Lounge"] 
  },
  { 
    name: "ESG Building", 
    subVenues: ["Cinema Hall 1", "Cinema Hall 2", "Panel Room"] 
  },
  { 
    name: "Directorate of Accounts", 
    subVenues: ["Ground Floor", "First Floor", "Second Floor", "The Studio"] 
  },
];

const VENUE_HITS: SearchHit[] = VENUES.flatMap((v) => [
  { kind: "Venue", title: v.name, to: "/venues" },
  ...v.subVenues.map((s) => ({
    kind: "Venue" as const,
    title: s,
    subtitle: v.name,
    to: "/venues",
  })),
]);

const CURATOR_HITS: SearchHit[] = CURATORS.map((c) => ({
  kind: "Curator",
  title: c.name,
  subtitle: c.discipline,
  to: `/curators/${encodeURIComponent(c.name)}`,
}));

const PROGRAMME_HITS: SearchHit[] = PROGRAMMES.map((p) => ({
  kind: "Programme",
  title: p.title,
  subtitle: `${p.category} · ${p.venue}`,
  to: `/programmes/${p.id}`,
  search: { p: p.id },
}));

const INDEX: SearchHit[] = [...PAGES, ...VENUE_HITS, ...CURATOR_HITS, ...PROGRAMME_HITS];

export function searchSite(query: string, limit = 20): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  
  const scored: { h: SearchHit; s: number }[] = [];
  
  for (const hit of INDEX) {
    const title = hit.title.toLowerCase();
    const subtitle = (hit.subtitle ?? "").toLowerCase();
    let score = 0;
    
    // Exact match gets highest score
    if (title === q) score = 100;
    // Starts with query
    else if (title.startsWith(q)) score = 60;
    // Contains query
    else if (title.includes(q)) score = 40;
    // Subtitle contains query
    else if (subtitle.includes(q)) score = 20;
    
    if (score > 0) {
      scored.push({ h: hit, s: score });
    }
  }
  
  return scored
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.h);
}