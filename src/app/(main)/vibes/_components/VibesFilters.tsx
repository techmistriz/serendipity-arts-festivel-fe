import VibesFilterSelect from "./VibesFilterSelect";

interface VibesFiltersProps {
  region: string;
  area: string;
  regions: string[];
  areas: string[];
  onRegionChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  onClear: () => void;
}

export default function VibesFilters({
  region,
  area,
  regions,
  areas,
  onRegionChange,
  onAreaChange,
  onClear,
}: VibesFiltersProps) {
  const hasActiveFilters = region !== "All" || area !== "All";

  return (
    <section className="mt-10">
      <p className="label mb-3">Filters</p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <VibesFilterSelect
          label="Select Region"
          value={region}
          options={regions}
          onChange={onRegionChange}
        />

        <VibesFilterSelect
          label="Select Area"
          value={area}
          options={areas}
          onChange={onAreaChange}
        />
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="label mt-3 text-muted-foreground transition-colors hover:text-accent"
        >
          Clear all ×
        </button>
      )}
    </section>
  );
}
