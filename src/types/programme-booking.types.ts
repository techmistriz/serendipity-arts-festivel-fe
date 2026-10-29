export type ProgrammeBookingFilters = { userName: string; email: string; date: string };
export type ApiProgrammeBooking = {
  id: number;
  order_id: number;
  program_detail_id: number;
  program_to_time: string | null;
  program_from_time: string | null;
  program_date: string | null;
  program_name: string | null;
  order: {
    id: number;
    name: string | null;
    email: string | null;
    contact: string | number | null;
    status: string | null;
  } | null;
  program_detail: {
    id: number;
    venue: { id: number; title: string | null } | null;
    sub_venue: { id: number; title: string | null } | null;
  } | null;
};
export type ProgrammeBooking = {
  id: number;
  userName: string;
  email: string;
  contact: string;
  programmeName: string;
  programmeDate: string;
  time: string;
  venue: string;
  status: string;
};
