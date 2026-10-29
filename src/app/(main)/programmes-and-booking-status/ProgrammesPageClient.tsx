"use client";

import { useProgrammeBookings } from "@/hooks/useProgrammeBookings";
import {
  formatBookingDate,
  bookingStatusClass,
  bookingStatusLabel,
} from "@/utils/programme-booking.utils";
import { useState } from "react";
import { PROGRAMME_DAYS } from "../programmes/constants";

export function ProgrammesPageClient({ code }: { code: string }) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!filters.userName.trim() && !filters.email.trim() && !filters.date) {
      setValidationError("Please enter a name, email, or select a date.");
      return;
    }

    setValidationError(null);
    void applyFilters();
  };

  const handleReset = () => {
    setValidationError(null);
    resetFilters();
  };

  const {
    filters,
    setFilters,
    results,
    loading,
    error,
    exportError,
    exportingId,
    applyFilters,
    resetFilters,
    exportBooking,
  } = useProgrammeBookings(code);

  const inputClass =
    "h-[44px] w-full min-w-0 rounded-none border px-2 text-base text-black placeholder:text-black/70 focus:outline-none focus:ring-0 focus:shadow-none";
  const buttonClass =
    "h-[43px] whitespace-nowrap rounded-full bg-black px-7 text-sm font-bold uppercase text-white transition-colors cursor-pointer ";

  return (
    <main
      className={`bg-white pt-9 md:px-10 md:py-20 text-[#101820] ${results === null ? "pb-4" : "pb-16"}`}
    >
      <div className="mx-auto w-full max-w-[1600px] px-5 md:px-[54px]">
        <h1 className="font-display text-left text-4xl md:text-[9vw] font-black uppercase leading-[1.15] tracking-[-0.025em] text-black">
          Programmes
        </h1>

        <form
          onSubmit={handleFilter}
          onReset={handleReset}
          className="mt-12 grid grid-cols-1 items-center gap-[7px] sm:grid-cols-2 lg:mt-[68px] lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1fr)_auto_auto]"
        >
          <div className="min-w-0">
            <label htmlFor="programme-user-name" className="sr-only">
              User name
            </label>
            <input
              id="programme-user-name"
              type="text"
              autoComplete="off"
              placeholder="User Name"
              value={filters.userName}
              onChange={(event) =>
                setFilters((current) => ({ ...current, userName: event.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="programme-email" className="sr-only">
              Email
            </label>
            <input
              id="programme-email"
              type="text"
              inputMode="email"
              autoComplete="off"
              placeholder="Email"
              value={filters.email}
              onChange={(event) =>
                setFilters((current) => ({ ...current, email: event.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div className="relative min-w-0">
            <label htmlFor="programme-date" className="sr-only">
              Select Date
            </label>

            <select
              id="programme-date"
              value={filters.date}
              onChange={(event) => {
                setFilters((current) => ({
                  ...current,
                  date: event.target.value,
                }));
                setValidationError(null);
              }}
              className={`${inputClass} appearance-none cursor-pointer pr-10`}
            >
              <option value="">Select Date</option>

              {PROGRAMME_DAYS.map((day) => (
                <option key={day} value={`2026-12-${String(day).padStart(2, "0")}`}>
                  {day} Dec
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className="label pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              ▾
            </span>
          </div>
          <button type="submit" disabled={loading} className={`${buttonClass} `}>
            {loading ? "Filtering…" : "Filter"}
          </button>
          <button type="reset" className={`${buttonClass} sm:col-span-2 lg:col-span-1`}>
            Reset Filter
          </button>
        </form>

        {validationError && (
          <p role="alert" className="mt-4 text-center text-sm text-red-700">
            {validationError}
          </p>
        )}

        {loading && (
          <div role="status" className="flex min-h-[160px] items-center justify-center">
            <p className="text-base font-medium">Loading bookings…</p>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-6 text-base text-red-700">
            {error}
          </p>
        )}
        {exportError && (
          <p role="alert" className="mt-6 text-base text-red-700">
            {exportError}
          </p>
        )}
        {results !== null && (
          <section className="mt-[52px] px-0 md:px-[10px]" aria-label="Programme results">
            <h2 className="mb-3 text-[23px] font-extrabold leading-7" aria-live="polite">
              Total Records: {results.length}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] table-fixed border-collapse text-center text-[13px] leading-[21px] text-[#10233b]">
                <caption className="sr-only">
                  Programme bookings matching the submitted filters
                </caption>
                <colgroup>
                  {["4%", "8.5%", "17%", "8.5%", "14%", "8%", "10%", "17%", "9%", "7%"].map(
                    (width, index) => (
                      <col key={index} style={{ width }} />
                    ),
                  )}
                </colgroup>
                <thead>
                  <tr>
                    {[
                      "Sr. No",
                      "User Name",
                      "Email",
                      "Contact",
                      "Program Name",
                      "Program Date",
                      "Time",
                      "Venue/Sub Venue",
                      "Booking Status",
                      "Export",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="border border-[#d9dfe7] px-2 py-[7px] font-semibold"
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
                        className="border border-[#d9dfe7] px-4 py-8 text-sm text-gray-600"
                      >
                        No programmes found. Try different filters.
                      </td>
                    </tr>
                  ) : (
                    results.map((booking, index) => (
                      <tr key={booking.id}>
                        <td className="border border-[#d9dfe7] px-1 py-[7px] align-top">
                          {index + 1}
                        </td>
                        <td className="border border-[#d9dfe7] px-2 py-[7px] align-top">
                          {booking.userName}
                        </td>
                        <td className="break-words border border-[#d9dfe7] px-1 py-[7px] align-top">
                          {booking.email}
                        </td>
                        <td className="border border-[#d9dfe7] px-1 py-[7px] align-top">
                          {booking.contact}
                        </td>
                        <td className="border border-[#d9dfe7] px-2 py-[7px] align-top">
                          {booking.programmeName}
                        </td>
                        <td className="border border-[#d9dfe7] px-2 py-[7px] align-top">
                          {formatBookingDate(booking.programmeDate)}
                        </td>
                        <td className="border border-[#d9dfe7] px-1 py-[7px] align-top">
                          {booking.time}
                        </td>
                        <td className="border border-[#d9dfe7] px-1 py-[7px] align-top">
                          {booking.venue}
                        </td>
                        <td className="border border-[#d9dfe7] px-1 py-[6px] align-top">
                          <span
                            className={`inline-flex min-h-8 items-center rounded-[3px] px-[10px] text-xs ${bookingStatusClass(booking.status)}`}
                          >
                            {bookingStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td className="border border-[#d9dfe7] px-1 py-[6px] align-top">
                          <button
                            type="button"
                            disabled={exportingId === booking.id}
                            onClick={() => void exportBooking(booking)}
                            aria-label={`Export booking ${booking.id}`}
                            aria-busy={exportingId === booking.id}
                            className="min-h-8 rounded-[3px] bg-[#0d6efd] px-[11px] text-xs text-white disabled:opacity-50 disabled:cursor-wait hover:bg-[#0b5ed7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 cursor-pointer"
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
          </section>
        )}
      </div>
    </main>
  );
}

export default ProgrammesPageClient;
