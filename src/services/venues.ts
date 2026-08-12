import api from "./axios";

export interface ApiVenue {
  id: number;
  parent_id: number;
  title: string;
  description: string;
  featured_image: string | null;
  accesebility_icon: string | null;
  google_map_url: string | null;
  accessibility_ids: string[];
  is_hide_on_frontend: number;
  parent: ApiVenue | null;
  childs: ApiVenue[];
}

export interface VenueProgram {
  id: number;
  venue_id: number;
  program_id: number;
  event_date: string;
  from_time: string;
  to_time: string;
  program: {
    id: number;
    name: string;
    category_id: number;
    curator_ids: string[];
    curators: {
      id: number;
      name: string;
      slug: string;
      short_description: string;
    }[];
    category: {
      id: number;
      name: string;
      font_color: string;
      background_color: string;
    };
  };
}

export interface VenueDetail extends ApiVenue {
  city_id: number;
  status: number;
  accessibility: {
    id: number;
    name: string;
    icon: string | null;
    description: string;
  }[];
  program_details: VenueProgram[];
}

interface VenuesResponse {
  status: boolean;
  data: ApiVenue[];
}

interface VenueDetailResponse {
  status: boolean;
  data: VenueDetail;
}

export async function getVenues(): Promise<ApiVenue[]> {
  const response = await api.get<VenuesResponse>("/venues");

  return response.data.data || [];
}

export async function getVenueDetail(
  id: number
): Promise<VenueDetail> {
  const response = await api.get<VenueDetailResponse>(
    `/venue-detail/${id}`
  );

  return response.data.data;
}