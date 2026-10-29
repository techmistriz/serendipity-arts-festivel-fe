"use client";

import { useEffect, useRef, useState } from "react";

import type {
  DailyProgramme,
  DailyReportFilters,
  DailyReportVenue,
} from "@/types/programme-daily-report.types";
import { EMPTY_DAILY_FILTERS } from "@/utils/programme-daily-report.utils";
import { bookingErrorMessage } from "@/utils/programme-booking.utils";
import {
  exportProgrammeDailyReport,
  exportSingleProgrammeReport,
  getProgrammeDailyReport,
} from "@/services/programme-daily-report.service";

type ReportState = {
  filters: DailyReportFilters | null;
  code: string;
  retry: number;
  rows: DailyProgramme[];
  error: string | null;
};

export function useProgrammeDailyReport(code: string) {
  const [filters, setFilters] = useState<DailyReportFilters>({
    ...EMPTY_DAILY_FILTERS,
  });
  const [venues, setVenues] = useState<DailyReportVenue[]>([]);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<number | "all" | null>(null);
  const [retry, setRetry] = useState(0);

  const [reportState, setReportState] = useState<ReportState>({
    filters: null,
    code: "",
    retry: -1,
    rows: [],
    error: null,
  });

  const exportController = useRef<AbortController | null>(null);

  const isCurrentReport =
    reportState.filters === filters && reportState.code === code && reportState.retry === retry;

  const loading = !isCurrentReport;
  const results = isCurrentReport ? reportState.rows : [];
  const error = isCurrentReport ? reportState.error : null;

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const rows = await getProgrammeDailyReport(code, filters, controller.signal);

        if (controller.signal.aborted) return;

        setReportState({
          filters,
          code,
          retry,
          rows,
          error: null,
        });

        if (!filters.date && !filters.amountType && !filters.venueId) {
          const options = new Map<string, string>();

          rows.forEach((row) => {
            if (row.venueId) {
              options.set(row.venueId, row.venueName);
            }
          });

          setVenues(
            [...options]
              .map(([id, title]) => ({ id, title }))
              .sort((a, b) => a.title.localeCompare(b.title)),
          );
        }
      } catch (cause) {
        const message = await bookingErrorMessage(
          cause,
          "Unable to load daily report. Please try again.",
        );

        if (controller.signal.aborted) return;

        setReportState({
          filters,
          code,
          retry,
          rows: [],
          error: message,
        });
      }
    }

    void load();

    return () => controller.abort();
  }, [code, filters, retry]);

  useEffect(() => {
    return () => {
      exportController.current?.abort();
    };
  }, []);

  function resetFilters() {
    setFilters({ ...EMPTY_DAILY_FILTERS });
    setExportError(null);
  }

  async function exportReport(row?: DailyProgramme) {
    if (exportController.current) return;

    const controller = new AbortController();
    exportController.current = controller;

    setExporting(row ? row.id : "all");
    setExportError(null);

    try {
      const blob = row
        ? await exportSingleProgrammeReport(code, row.id, controller.signal)
        : await exportProgrammeDailyReport(code, controller.signal);

      if (controller.signal.aborted) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = row ? `programme-report-${row.id}.xlsx` : "programmes-daily-report.xlsx";

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      const message = await bookingErrorMessage(
        cause,
        "Unable to export report. Please try again.",
      );

      if (!controller.signal.aborted) {
        setExportError(message);
      }
    } finally {
      if (exportController.current === controller) {
        exportController.current = null;
      }

      if (!controller.signal.aborted) {
        setExporting(null);
      }
    }
  }

  return {
    filters,
    setFilters,
    results,
    venues,
    loading,
    error,
    exportError,
    exporting,
    resetFilters,
    exportReport,
    retryReport: () => setRetry((value) => value + 1),
  };
}
