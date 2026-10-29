import axios from "axios";
import type {
  ApiProgrammeBooking,
  ProgrammeBooking,
  ProgrammeBookingFilters,
} from "@/types/programme-booking.types";

export const EMPTY_BOOKING_FILTERS: ProgrammeBookingFilters = { userName: "", email: "", date: "" };
export function bookingQuery(filters: ProgrammeBookingFilters) {
  return {
    ...(filters.userName.trim() ? { name: filters.userName.trim() } : {}),
    ...(filters.email.trim() ? { email: filters.email.trim() } : {}),
    ...(filters.date ? { program_date: filters.date } : {}),
  };
}
export function formatBookingDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value || "N/A";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${match[3]}-${months[Number(match[2]) - 1] ?? match[2]}-${match[1]}`;
}
export function formatBookingTime(value: string | null) {
  if (!value) return "N/A";
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(value);
  if (!match) return value;
  const hours = Number(match[1]);
  return `${String(hours % 12 || 12).padStart(2, "0")}:${match[2]} ${hours >= 12 ? "PM" : "AM"}`;
}
export function mapProgrammeBooking(row: ApiProgrammeBooking): ProgrammeBooking {
  return {
    id: row.id,
    userName: row.order?.name || "N/A",
    email: row.order?.email || "N/A",
    contact: String(row.order?.contact ?? "N/A"),
    programmeName: row.program_name || "N/A",
    programmeDate: row.program_date || "",
    time: `${formatBookingTime(row.program_from_time)} - ${formatBookingTime(row.program_to_time)}`,
    venue: `${row.program_detail?.venue?.title || "N/A"}/${row.program_detail?.sub_venue?.title || "N/A"}`,
    status: row.order?.status?.trim().toUpperCase() || "UNKNOWN",
  };
}
export function bookingStatusClass(status: string) {
  switch (status) {
    case "SUCCESS":
      return "bg-[#13894f] text-white";
    case "PENDING":
      return "bg-[#ffc107] text-black";
    case "FAILED":
      return "bg-red-600 text-white";
    case "CANCELLED":
      return "bg-gray-600 text-white";
    default:
      return "bg-gray-200 text-gray-900";
  }
}
export function bookingStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}
export async function bookingErrorMessage(error: unknown, fallback: string): Promise<string> {
  if (axios.isAxiosError(error)) {
    let data: unknown = error.response?.data;
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      try {
        data = JSON.parse(await data.text());
      } catch {
        return fallback;
      }
    }
    if (data && typeof data === "object" && "message" in data && typeof data.message === "string")
      return data.message;
  }
  return error instanceof Error && !axios.isAxiosError(error) ? error.message : fallback;
}
export function downloadBookingFile(blob: Blob, bookingId: number) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `programme-booking-${bookingId}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
