export interface ProgrammeCategory {
  id: number;
  name: string;
  font_color: string;
  background_color: string;
}

export interface ProgrammeDiscipline {
  id: number;
  name: string;
  font_color: string;
  background_color: string;
}

export interface ProgrammeCity {
  id: number;
  name: string;
}

export interface Programme {
  id: number;
  booking_type: string | null;
  program_type: string;
  parent_id: number;
  name: string;
  slug: string;
  amount: number;

  event_date: string | null;
  from_time: string | null;
  to_time: string | null;

  total_seats: number | null;
  vip_seats: number | null;

  short_description: string;
  description: string;

  category_id: number;
  program_city_id: number;
  venue_id: number | null;
  discipline_id: number;

  curator_ids: string[];
  artist_title: string | null;
  artist_ids: string[];

  disclaimer: string | null;
  program_tag_ids: string[];
  sponsor_ids: string[];

  hide_mix_blend: number;
  external_link: string | null;

  program_image: string;

  artists: unknown | null;

  ordering: number;
  status: number;

  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;

  has_featured: number;
  has_vip: number;

  created_by: number;
  updated_by: number;

  created_at: string;
  updated_at: string;

  sponsor_title: string | null;

  webhook_status: number;
  webhook_response: string | null;

  is_booking_allowed: number;

  deleted_at: string | null;
  deleted_by: number | null;

  category: ProgrammeCategory | null;
  discipline: ProgrammeDiscipline | null;
  program_city: ProgrammeCity | null;
}

export interface ProgrammePagination {
  current_page: number;
  data: Programme[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export interface ProgrammesResponse {
  status: boolean;
  message?: string;
  data: Programme[] | ProgrammePagination;
}
