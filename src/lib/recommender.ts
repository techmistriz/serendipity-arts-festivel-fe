import { RECOMMENDER_OPTIONS } from "@/data/recommender";
import { mapApiProgrammesToUi } from "@/lib/programme-adapter";
import { getProgrammes } from "@/services/programme.service";
import type { UIProgramme } from "@/types/programme";

export type RecommenderFilters = {
  categorySlugs: string[];
  disciplineSlugs: string[];
};

export function getRecommenderFilters(selected: string[]): RecommenderFilters {
  const categorySlugs = new Set<string>();
  const disciplineSlugs = new Set<string>();

  for (const id of selected) {
    const opt = RECOMMENDER_OPTIONS.find((o) => o.id === id);
    opt?.categorySlugs?.forEach((slug) => categorySlugs.add(slug));
    opt?.disciplineSlugs?.forEach((slug) => disciplineSlugs.add(slug));
  }

  return {
    categorySlugs: [...categorySlugs],
    disciplineSlugs: [...disciplineSlugs],
  };
}

export async function recommendProgrammes(selected: string[], limit = 12): Promise<UIProgramme[]> {
  const filters = getRecommenderFilters(selected);

  if (!filters.categorySlugs.length && !filters.disciplineSlugs.length) {
    return [];
  }

  const programmes = await getProgrammes(undefined, limit, {
    ...filters,
    classificationMatch: "any",
  });

  return mapApiProgrammesToUi(programmes);
}
