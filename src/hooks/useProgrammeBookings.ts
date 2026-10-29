"use client";

import { useEffect, useRef, useState } from "react";
import { exportProgrammeBooking, getProgrammeBookings } from "@/services/programme-booking.service";
import type { ProgrammeBooking } from "@/types/programme-booking.types";
import {
  bookingErrorMessage,
  downloadBookingFile,
  EMPTY_BOOKING_FILTERS,
} from "@/utils/programme-booking.utils";

export function useProgrammeBookings(code: string) {
  const [filters, setFilters] = useState({ ...EMPTY_BOOKING_FILTERS });
  const [results, setResults] = useState<ProgrammeBooking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<number | null>(null);
  const searchController = useRef<AbortController | null>(null);
  const exportController = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      searchController.current?.abort();
      exportController.current?.abort();
    },
    [],
  );

  async function applyFilters() {
    searchController.current?.abort();
    exportController.current?.abort();
    exportController.current = null;
    setExportingId(null);
    const controller = new AbortController();
    searchController.current = controller;
    setLoading(true);
    setError(null);
    setExportError(null);
    setResults(null);
    try {
      const rows = await getProgrammeBookings(code, filters, controller.signal);
      if (!controller.signal.aborted) setResults(rows);
    } catch (cause) {
      const message = await bookingErrorMessage(
        cause,
        "Unable to load bookings. Please try again.",
      );
      if (!controller.signal.aborted) setError(message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  function resetFilters() {
    searchController.current?.abort();
    exportController.current?.abort();
    exportController.current = null;
    setFilters({ ...EMPTY_BOOKING_FILTERS });
    setResults(null);
    setLoading(false);
    setError(null);
    setExportError(null);
    setExportingId(null);
  }

  async function exportBooking(booking: ProgrammeBooking) {
    if (exportController.current && !exportController.current.signal.aborted) return;
    const controller = new AbortController();
    exportController.current = controller;
    setExportingId(booking.id);
    setExportError(null);
    try {
      const blob = await exportProgrammeBooking(code, booking.id, controller.signal);
      if (!controller.signal.aborted) downloadBookingFile(blob, booking.id);
    } catch (cause) {
      const message = await bookingErrorMessage(
        cause,
        "Unable to export booking. Please try again.",
      );
      if (!controller.signal.aborted) setExportError(message);
    } finally {
      if (exportController.current === controller) {
        exportController.current = null;
        if (!controller.signal.aborted) setExportingId(null);
      }
    }
  }

  return {
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
  };
}
