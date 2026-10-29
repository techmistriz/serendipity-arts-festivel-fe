"use client";

import { useProgrammeDailyReport } from "@/hooks/useProgrammeDailyReport";
// import type { DailyReportFilters } from "@/types/programme-daily-report.types";
// import { DAILY_REPORT_DAYS, DAILY_REPORT_YEAR } from "@/utils/programme-daily-report.utils";
import { formatBookingDate } from "@/utils/programme-booking.utils";
import { ProgrammeReportFilters } from "./ProgrammeReportFilters";

export default function ProgrammesDailyReportClient({ code }: { code: string }) {
  const {
    filters,
    setFilters,
    results,
    // venues,
    loading,
    error,
    exportError,
    exporting,
    resetFilters,
    exportReport,
    retryReport,
  } = useProgrammeDailyReport(code);

  const cellClass = "border border-[#d9dfe7] px-2 py-3 align-top";
  return (
    <main className="bg-white py-9 text-[#061641] md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-[1600px] px-5 md:px-[54px]">
        <h1 className="font-display text-left text-4xl md:text-[9vw] font-black uppercase leading-[1.15] tracking-[-0.025em] text-black">
          Programmes
        </h1>
        <ProgrammeReportFilters
          filters={filters}
          onChange={(updates) =>
            setFilters((current) => ({
              ...current,
              ...updates,
            }))
          }
          onReset={resetFilters}
        />

        {loading && (
          <div role="status" className="flex min-h-[160px] items-center justify-center">
            <p className="text-base font-medium">Loading report…</p>
          </div>
        )}
        {error && (
          <div role="alert" className="mt-6 text-center">
            <p className="text-base text-red-700">{error}</p>
            <button type="button" onClick={retryReport} className="mt-3 cursor-pointer underline">
              Try again
            </button>
          </div>
        )}
        {exportError && (
          <p role="alert" className="mt-4 text-center text-base text-red-700">
            {exportError}
          </p>
        )}
        {!loading && !error && (
          <section className="mt-[46px] md:px-2" aria-label="Programmes daily report">
            <div className="mb-[6px] flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-[#20252a]" aria-live="polite">
                Total Records: {results.length}
              </h2>
              <button
                type="button"
                disabled={exporting === "all"}
                onClick={() => void exportReport()}
                title="Export the full report"
                className="cursor-pointer rounded-[2px] bg-[#168650] px-2 py-[6px] text-sm text-white hover:bg-[#106b40] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exporting === "all" ? "Exporting…" : "Export Excel"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] table-fixed border-collapse text-center text-sm leading-6">
                <caption className="sr-only">
                  Daily programmes, booking counts and capacities
                </caption>
                <colgroup>
                  {["5%", "19.5%", "14.5%", "8%", "11.5%", "6%", "8%", "6.5%", "15%", "6%"].map(
                    (width, index) => (
                      <col key={index} style={{ width }} />
                    ),
                  )}
                </colgroup>
                <thead>
                  <tr>
                    {[
                      "Sr. No",
                      "Programme Name",
                      "Category",
                      "Date",
                      "Time",
                      "Booking",
                      "VIP Booking",
                      "Free/Paid",
                      "Venue",
                      "Export",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className={`${cellClass} align-bottom font-semibold`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="border border-[#d9dfe7] px-4 py-10 text-sm text-gray-600"
                      >
                        No programmes found. Try different filters.
                      </td>
                    </tr>
                  ) : (
                    results.map((row, index) => (
                      <tr key={row.id}>
                        <td className={cellClass}>{index + 1}</td>
                        <td className={`${cellClass} text-left`}>{row.programmeName}</td>
                        <td className={cellClass}>
                          <span
                            className="inline-flex min-h-[27px] items-center px-2"
                            style={{
                              color: row.categoryTextColor,
                              backgroundColor: row.categoryBackgroundColor,
                            }}
                          >
                            {row.category}
                          </span>
                        </td>
                        <td className={cellClass}>{formatBookingDate(row.date)}</td>
                        <td className={cellClass}>{row.time}</td>
                        <td className={cellClass}>
                          <span className="block text-[#0d6efd]">{row.bookings}</span>
                          <span className="block">{row.capacity}</span>
                        </td>
                        <td className={cellClass}>
                          <span className="block text-[#0d6efd]">{row.vipBookings}</span>
                          <span className="block">{row.vipCapacity ?? "N/A"}</span>
                        </td>
                        <td className={`${cellClass} align-middle`}>
                          <span
                            className={`inline-block rounded-[2px] px-1 text-xs font-bold leading-5 ${row.admission === "Free" ? "bg-[#168650] text-white" : "bg-[#ffc107] text-black"}`}
                          >
                            {row.admission}
                          </span>
                        </td>
                        <td className={cellClass}>{row.venue}</td>
                        <td className={cellClass}>
                          <button
                            type="button"
                            disabled={exporting === row.id}
                            onClick={() => void exportReport(row)}
                            aria-label={`Export ${row.programmeName} on ${formatBookingDate(row.date)}`}
                            aria-busy={exporting === row.id}
                            className="min-h-[25px] cursor-pointer rounded-[2px] bg-[#0d6efd] px-[7px] text-sm text-white hover:bg-[#0b5ed7] disabled:cursor-wait disabled:opacity-50"
                          >
                            Export
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="sr-only">Booking columns show the booked count above the capacity.</p>
          </section>
        )}
      </div>
    </main>
  );
}
