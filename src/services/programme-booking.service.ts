import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { ApiProgrammeBooking, ProgrammeBookingFilters } from "@/types/programme-booking.types";
import { getApiResponseData } from "@/utils/api";
import { bookingQuery, mapProgrammeBooking } from "@/utils/programme-booking.utils";

export async function getProgrammeBookings(
  code: string,
  filters: ProgrammeBookingFilters,
  signal?: AbortSignal,
) {
  const response = await API<ApiResponse<ApiProgrammeBooking[]>>(
    `/programmes-and-booking-status/${encodeURIComponent(code)}`,
    METHODS.GET,
    bookingQuery(filters),
    undefined,
    { signal },
  );
  const rows = getApiResponseData(response, "Unable to load programme bookings.");
  if (!Array.isArray(rows)) throw new Error("Unexpected bookings response.");
  return rows.map(mapProgrammeBooking);
}

export async function exportProgrammeBooking(
  code: string,
  bookingId: number,
  signal?: AbortSignal,
): Promise<Blob> {
  const blob = await API<Blob>(
    `/export-programmes-and-booking/${encodeURIComponent(code)}/${bookingId}`,
    METHODS.GET,
    undefined,
    undefined,
    { responseType: "blob", signal },
  );
  if (!(blob instanceof Blob) || blob.size === 0) throw new Error("The export file is empty.");
  if (/json|text\/html/i.test(blob.type)) {
    let message = "The API did not return an Excel file.";
    try {
      const data: unknown = JSON.parse(await blob.text());
      if (data && typeof data === "object" && "message" in data && typeof data.message === "string")
        message = data.message;
    } catch {
      /* Keep the fallback for non-JSON responses. */
    }
    throw new Error(message);
  }
  return blob;
}
