import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { DailyReportData, DailyReportFilters } from "@/types/programme-daily-report.types";
import { getApiResponseData } from "@/utils/api";
import { dailyReportQuery, mapDailyProgramme } from "@/utils/programme-daily-report.utils";

export async function getProgrammeDailyReport(
  code: string,
  filters: DailyReportFilters,
  signal?: AbortSignal,
) {
  const response = await API<ApiResponse<DailyReportData>>(
    `/programmes-daily-report/${encodeURIComponent(code)}`,
    METHODS.GET,
    dailyReportQuery(filters),
    undefined,
    { signal },
  );
  const data = getApiResponseData(response, "Unable to load daily report.");
  if (!data || !Array.isArray(data.program_details))
    throw new Error("Unexpected daily report response.");
  return data.program_details.map(mapDailyProgramme);
}

async function getExcel(endpoint: string, signal?: AbortSignal) {
  const blob = await API<Blob>(endpoint, METHODS.GET, undefined, undefined, {
    responseType: "blob",
    signal,
  });
  if (!(blob instanceof Blob) || !blob.size) throw new Error("The export file is empty.");
  if (/json|text\/html/i.test(blob.type)) {
    let message = "The API did not return an Excel file.";
    try {
      const data: unknown = JSON.parse(await blob.text());
      if (data && typeof data === "object" && "message" in data && typeof data.message === "string")
        message = data.message;
    } catch {
      /* Keep fallback for non-JSON errors. */
    }
    throw new Error(message);
  }
  return blob;
}
export function exportProgrammeDailyReport(code: string, signal?: AbortSignal) {
  // No filter query parameters were documented for this export endpoint.
  return getExcel(`/daily-program-report-export/${encodeURIComponent(code)}`, signal);
}
export function exportSingleProgrammeReport(code: string, detailId: number, signal?: AbortSignal) {
  // Assumes the backend expects program_details[].id. Change this caller if it expects program_id.
  return getExcel(`/single-program-report-export/${encodeURIComponent(code)}/${detailId}`, signal);
}
