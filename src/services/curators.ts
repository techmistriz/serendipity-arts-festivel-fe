import api from "@/lib/api-client";

export interface ApiDiscipline {
  id: number;
  slug: string;
  name: string;
  font_color: string;
  background_color: string;
}

export interface ApiCurator {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  instagram_link: string | null;
  instagram_handle: string | null;
  curator_image: string | null;
  discipline_id: number;
  discipline: ApiDiscipline | null;
}

export interface CuratorDetail extends ApiCurator {
  bio: string;
  hide_on_frontend: number;
  status: number;
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  schema_tag: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  webhook_status: number;
  webhook_response: string | null;
  ordering: number;
}

export interface ApiProgramCategory {
  id: number;
  name: string;
  font_color: string;
  background_color: string;
}

export interface ApiVenue {
  id: number;
  parent_id: number;
  title: string;
  description: string;
  city_id: number;
  featured_image: string | null;
  accesebility_icon: string | null;
  google_map_url: string | null;
  accessibility_ids: number[] | null;
  status: number;
  is_hide_on_frontend: number;
}

export interface ApiProgramDetail {
  id: number;
  program_id: number;
  venue_id: number | null;
  event_date: string;
  from_time: string;
  to_time: string;
  venue: ApiVenue | null;
}

export interface ApiProgram {
  id: number;
  name: string;
  slug: string;
  program_image: string | null;
  category_id: number;
  venue_id: number | null;
  program_type: string;
  booking_type: string | null;
  is_booking_allowed: number;
  curator_ids: string[];
  category: ApiProgramCategory | null;
  program_details: ApiProgramDetail[];
}

export interface CuratorDetailData {
  curator: CuratorDetail;
  programs: ApiProgram[];
}

interface CuratorsResponse {
  status: boolean;
  data: ApiCurator[];
}

interface CuratorDetailResponse {
  status: boolean;
  data: CuratorDetailData;
}

export async function getCurators(): Promise<ApiCurator[]> {
  const response = await api.get<CuratorsResponse>("/curators");

  return response.data.data || [];
}

export async function getCuratorDetail(slug: string): Promise<CuratorDetailData> {
  const response = await api.get<CuratorDetailResponse>(`/curator/${slug}`);

  return response.data.data;
}
