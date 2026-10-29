"use client";

import { useMemo } from "react";

import { useVenues } from "@/hooks/useVenues";
import type { DailyReportFilters } from "@/types/programme-daily-report.types";
import { DAILY_REPORT_YEAR } from "@/utils/programme-daily-report.utils";
import { PROGRAMME_DAYS } from "@/app/(main)/programmes/constants";
import { FilterSelect } from "@/app/(main)/programmes/_components/FilterSelect";

type Props = {
  filters: DailyReportFilters;
  onChange: (updates: Partial<DailyReportFilters>) => void;
  onReset: () => void;
};

export function ProgrammeReportFilters({ filters, onChange, onReset }: Props) {
  const { venues } = useVenues();

  const venueOptions = useMemo(
    () => [
      { label: "All", value: "All" },
      ...venues.map((venue) => ({
        label: venue.title,
        value: String(venue.id),
      })),
    ],
    [venues],
  );

  return (
    <div className="mt-12 grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:mt-[55px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_200px]">
      <FilterSelect
        label="Select Date"
        value={filters.date ? `${Number(filters.date.split("-")[2])} Dec` : "All"}
        options={["All", ...PROGRAMME_DAYS.map((day) => `${day} Dec`)]}
        onChange={(value) => {
          onChange({
            date:
              value === "All"
                ? ""
                : `${DAILY_REPORT_YEAR}-12-${String(parseInt(value, 10)).padStart(2, "0")}`,
          });
        }}
      />

      <FilterSelect
        label="Select Free/Paid"
        value={
          filters.amountType === "free" ? "Free" : filters.amountType === "paid" ? "Paid" : "All"
        }
        options={["All", "Free", "Paid"]}
        onChange={(value) => {
          onChange({
            amountType: value === "Free" ? "free" : value === "Paid" ? "paid" : "",
          });
        }}
      />

      <FilterSelect
        label="Select Venue"
        value={filters.venueId || "All"}
        options={venueOptions}
        onChange={(value) => {
          onChange({
            venueId: value === "All" ? "" : value,
          });
        }}
      />

      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-[46px] w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-black px-8 text-base font-bold uppercase text-white "
      >
        Reset Filter
      </button>
    </div>
  );
}
