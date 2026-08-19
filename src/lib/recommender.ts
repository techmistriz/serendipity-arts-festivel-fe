import { RECOMMENDER_OPTIONS } from "@/data/recommender";
import { PROGRAMMES, type Programme } from "@/data/programmes-data";

export function recommendProgrammes(selected: string[], limit = 12): Programme[] {
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
