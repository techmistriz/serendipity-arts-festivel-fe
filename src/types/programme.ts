// API Response Types
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

export interface Venue {
  id: number;
  name: string;
  title?: string;
  // Add other venue fields as needed
}

export interface SubVenue {
  id: number;
  name: string;
  // Add other sub-venue fields as needed
}

export interface ProgramDetail {
  id: number;
  program_id: number;
  event_date: string; // "14-12-2025"
  from_time: string; // "11:00:00"
  to_time: string; // "12:00:00"
  total_seats: number;
  vip_seats: number;
  venue_id: number;
  sub_venue_id: number;
  status: number;
  created_at: string;
  updated_at: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_at: string | null;
  deleted_by: string | null;
  venue: Venue | null;
  sub_venue: SubVenue | null;
}

export interface ProgramTag {
  id: number;
  name: string;
  font_color: string;
  background_color: string;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  webhook_status: number;
  webhook_response: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
}

export interface ProgrammePerson {
  id: number;
  name: string;
}

export interface ProgrammeArtist {
  id: number;
  name: string;
}

export interface ProgrammeSponsor {
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
  short_description: string;
  description: string;
  category_id: number;
  program_city_id: number;
  venue_id: number | null;
  discipline_id: number;
  hide_mix_blend: number;
  sponsor_ids: string[];
  curator_ids: string[];
  artist_title: string | null;
  artist_ids: string[];
  disclaimer: string | null;
  program_tag_ids: string[];
  has_featured: number;
  external_link: string | null;
  has_vip: number;
  program_image: string;
  artists: ProgrammeArtist[] | null;
  sponsor_title: string | null;
  is_booking_allowed: number;
  ordering: number;
  status: number;
  amount: string | null; // "499" or null
  event_date: string | null;
  from_time: string | null;
  to_time: string | null;
  total_seats: string | null;
  vip_seats: string | null;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  webhook_status: number;
  webhook_response: string;
  deleted_at: string | null;
  deleted_by: string | null;
  category?: ProgrammeCategory;
  discipline?: ProgrammeDiscipline | null;
  program_city?: ProgrammeCity;
  program_details?: ProgramDetail[];
}

// API Response Types
export interface ProgrammesListResponse {
  status: boolean;
  data: {
    current_page: number;
    data: Programme[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
  meta: {
    paging: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
  message: string;
}

export interface ProgramDetailResponse {
  status: boolean;
  data: {
    program: Programme;
    program_tags: ProgramTag[];
    curators: ProgrammePerson[];
    artists: ProgrammeArtist[];
    sponsors: ProgrammeSponsor[];
    related_programs: Programme[];
    booking: {
      booking_allowed: number;
      booking_type: string | null;
      program_type: string;
      amount: string | null;
    };
  };
  meta: unknown[];
  message: string;
}

// UI Programme Type (for components)
export interface UIProgramme {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  discipline?: {
    name: string;
    font_color: string;
    background_color: string;
  };
  curator: string;
  curators: ProgrammePerson[];

  slots: {
    detailId?: number;
    day: number;
    fromTime: string;
    toTime: string;
  }[];

  venue: string;
  price: number;
  img: string;
  blurb: string;
  longBlurb: string;
  disclaimer?: string;
  tags: string[];
  isBookingAllowed: boolean;

  newlyAdded?: boolean;

  includes?: {
    title: string;
    time: string;
    category: string;
    note?: string;
    refId?: string;
  }[];

  addOns?: {
    id: string;
    title: string;
    category: string;
    day: number;
    time: string;
    price: number;
    blurb?: string;
  }[];
}

// Filter Types
export type ProgrammeFilters = {
  category: string;
  day: number | null;
  venue: string;
  tags: string[];
  query: string;
};
