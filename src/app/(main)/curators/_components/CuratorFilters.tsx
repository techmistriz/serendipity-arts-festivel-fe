import type { CuratorDiscipline } from "../types";

export type CuratorDisciplineFilter = "all" | number;

type CuratorFiltersProps = {
  disciplines: CuratorDiscipline[];
  selectedDiscipline: CuratorDisciplineFilter;
  onSelect: (discipline: CuratorDisciplineFilter) => void;
};

export function CuratorFilters({ disciplines, selectedDiscipline, onSelect }: CuratorFiltersProps) {
  return (
    <div
      className="mt-10 flex flex-wrap gap-x-4 gap-y-2 border-t border-rule pt-6 md:mt-14"
      aria-label="Filter curators by discipline"
      role="toolbar"
    >
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selectedDiscipline === "all"}
        className={getFilterClassName(selectedDiscipline === "all", selectedDiscipline !== "all")}
      >
        All
      </button>
      {disciplines.map((discipline) => (
        <button
          key={discipline.id}
          type="button"
          onClick={() => onSelect(discipline.id)}
          aria-pressed={selectedDiscipline === discipline.id}
          className={getFilterClassName(
            selectedDiscipline === discipline.id,
            selectedDiscipline !== "all",
          )}
        >
          {discipline.name}
        </button>
      ))}
    </div>
  );
}

function getFilterClassName(isSelected: boolean, hasActiveFilter: boolean) {
  if (isSelected) {
    return "display text-sm leading-none text-foreground underline decoration-2 decoration-accent underline-offset-[6px] uppercase transition-colors md:text-lg";
  }

  return `display text-sm leading-none uppercase transition-colors md:text-lg ${
    hasActiveFilter
      ? "text-muted-foreground/60 hover:text-foreground"
      : "text-foreground hover:text-accent"
  }`;
}
