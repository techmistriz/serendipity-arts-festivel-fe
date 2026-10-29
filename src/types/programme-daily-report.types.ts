export type DailyReportFilters = {
  date: string;
  amountType: "" | "free" | "paid";
  venueId: string;
};
export type ApiDailyProgramme = {
  id: number;
  program_id: number;
  event_date: string;
  from_time: string | null;
  to_time: string | null;
  total_seats: number;
  vip_seats: number | null;
  venue_id: number | null;
  sub_venue_id: number | null;
  program_amount: number | string | null;
  program_name: string | null;
  venue_name: string | null;
  subvenue_name: string | null;
  total_booked_seats: number | string | null;
  total_booked_seats_vip: number | string | null;
  program?: {
    category?: {
      name: string | null;
      font_color: string | null;
      background_color: string | null;
    } | null;
  } | null;
};
export type DailyReportData = { program_details: ApiDailyProgramme[] };
export type DailyProgramme = {
  id: number;
  programId: number;
  programmeName: string;
  category: string;
  categoryTextColor: string;
  categoryBackgroundColor: string;
  date: string;
  time: string;
  bookings: number;
  capacity: number;
  vipBookings: number;
  vipCapacity: number | null;
  admission: "Free" | "Paid" | "N/A";
  venueId: string;
  venueName: string;
  venue: string;
};
export type DailyReportVenue = { id: string; title: string };
