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
  name: string;
  slug: string;
  amount: number | null;
  parent_id: number | string;
  category_id: number | string;
  program_city_id: number | string;
  venue_id: number | string | null;
  discipline_id: number | string;
  hide_mix_blend: number | string;
  ordering: number | string;
  status: number | string;
  has_featured: number | string;
  has_vip: number | string;
  created_by: number | string;
  updated_by: number | string;
  webhook_status: number | string;
  is_booking_allowed: number | string;
  deleted_by: number | string | null;

  event_date: string | null;
  from_time: string | null;
  to_time: string | null;

  total_seats: number | null;
  vip_seats: number | null;

  short_description: string;
  description: string;

  curator_ids: string[];
  artist_title: string | null;
  artist_ids: string[];

  disclaimer: string | null;
  program_tag_ids: string[];
  sponsor_ids: string[];

  external_link: string | null;

  program_image: string;

  artists: unknown | null;

  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;

  created_at: string;
  updated_at: string;

  sponsor_title: string | null;

  webhook_response: string | null;

  deleted_at: string | null;

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
