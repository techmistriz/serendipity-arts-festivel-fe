import type {
  ApiDailyProgramme,
  DailyProgramme,
  DailyReportFilters,
} from "@/types/programme-daily-report.types";
import { formatBookingTime } from "@/utils/programme-booking.utils";

export const EMPTY_DAILY_FILTERS: DailyReportFilters = { date: "", amountType: "", venueId: "" };
export const DAILY_REPORT_DAYS = [13, 14, 15, 16, 17, 18, 19, 20];
export const DAILY_REPORT_YEAR = 2026;
export function dailyReportQuery(filters: DailyReportFilters) {
  return {
    ...(filters.date ? { event_date: filters.date } : {}),
    ...(filters.venueId ? { venue_id: filters.venueId } : {}),
    ...(filters.amountType ? { amount_type: filters.amountType } : {}),
  };
}
export function dailyDateToISO(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}
export function numericCount(value: number | string | null) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}
export function mapDailyProgramme(row: ApiDailyProgramme): DailyProgramme {
  // Assumption: null/zero amount means free. Confirm this backend convention.
  const amount = row.program_amount === null ? 0 : Number(row.program_amount);
  return {
    id: row.id,
    programId: row.program_id,
    programmeName: row.program_name || "N/A",
    // The supplied response has no category field; do not invent a category.
    category: row.program?.category?.name || "N/A",
    categoryTextColor: row.program?.category?.font_color || "#374151",
    categoryBackgroundColor: row.program?.category?.background_color || "#f3f4f6",
    date: dailyDateToISO(row.event_date),
    time: `${formatBookingTime(row.from_time)} - ${formatBookingTime(row.to_time)}`,
    bookings: numericCount(row.total_booked_seats),
    capacity: numericCount(row.total_seats),
    vipBookings: numericCount(row.total_booked_seats_vip),
    vipCapacity: row.vip_seats === null ? null : numericCount(row.vip_seats),
    admission: !Number.isFinite(amount) ? "N/A" : amount > 0 ? "Paid" : "Free",
    venueId: row.venue_id === null ? "" : String(row.venue_id),
    venueName: row.venue_name || "N/A",
    venue: `${row.venue_name || "N/A"}/${row.subvenue_name || "N/A"}`,
  };
}
