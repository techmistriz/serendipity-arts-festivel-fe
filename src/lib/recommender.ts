// Programme recommender: map self-description questions to programme tags/categories.
// New programmes added later will show up automatically as long as their
// category/tags match one of the mapped keywords below.
// import { PROGRAMMES, type Programme } from "./programmes-data";

import { Programme, PROGRAMMES } from "../data/programmes-data";

export type RecommenderOption = {
  id: string;
  label: string;
  // Any programme whose category OR any tag matches these strings (case-insensitive) is recommended.
  match: string[];
};

export const RECOMMENDER_OPTIONS: RecommenderOption[] = [
  {
    id: "reader",
    label: "I like to read a lot of books",
    match: ["Talk", "Theatre"],
  },
  {
    id: "theatre",
    label: "I like to watch theatre",
    match: ["Theatre", "Performance"],
  },
  {
    id: "exhibitions",
    label: "I like to enjoy art exhibitions",
    match: ["Exhibition", "Visual Arts"],
  },
  {
    id: "foodie",
    label: "I'm a foodie and love different cuisines",
    match: ["Culinary Arts"],
  },
  {
    id: "children",
    label: "I have children who'd enjoy stimulating programmes",
    match: ["Children's Programmes"],
  },
  {
    id: "crafts",
    label: "I'm into crafts — workshop or exhibition, either works",
    match: ["Crafts", "Workshop"],
  },
  {
    id: "films",
    label: "I'm a film enthusiast and love underrated films",
    match: ["Film Screening"],
  },
  {
    id: "workshops",
    label: "I just like attending workshops",
    match: ["Workshop"],
  },
  { id: "music", label: "I love live music", match: ["Music", "Performance"] },
  {
    id: "dance",
    label: "I love dance and movement",
    match: ["Dance", "Performance"],
  },
];

export function recommendProgrammes(
  selected: string[],
  limit = 12,
): Programme[] {
  if (!selected.length) return [];
  const wantedRaw = new Set<string>();
  for (const id of selected) {
    const opt = RECOMMENDER_OPTIONS.find((o) => o.id === id);
    if (opt) for (const m of opt.match) wantedRaw.add(m.toLowerCase());
  }
  const scored = PROGRAMMES.map((p) => {
    const cat = p.category.toLowerCase();
    const tags = p.tags.map((t) => t.toLowerCase());
    let score = 0;
    for (const w of wantedRaw) {
      if (cat === w) score += 3;
      if (tags.includes(w)) score += 2;
    }
    return { p, score };
  }).filter((s) => s.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}
