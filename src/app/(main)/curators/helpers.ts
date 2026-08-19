import type { CuratorDiscipline, CuratorDisciplineFilter, CuratorListItem } from "./types";

export function getCuratorDisciplines(curators: CuratorListItem[]): CuratorDiscipline[] {
  const disciplines = new Map<number, CuratorDiscipline>();

  curators.forEach((curator) => {
    if (curator.discipline) {
      disciplines.set(curator.discipline.id, curator.discipline);
    }
  });

  return Array.from(disciplines.values());
}

export function filterCuratorsByDiscipline(
  curators: CuratorListItem[],
  discipline: CuratorDisciplineFilter,
): CuratorListItem[] {
  if (discipline === "all") return curators;

  return curators.filter((curator) => curator.discipline?.id === discipline);
}
