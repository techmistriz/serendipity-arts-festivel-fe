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

interface CuratorsResponse {
  status: boolean;
  data: ApiCurator[];
}

interface CuratorDetailResponse {
  status: boolean;
  data: {
    curator: CuratorDetail;
    programs: unknown[];
  };
}

export async function getCurators(): Promise<ApiCurator[]> {
  const response = await api.get<CuratorsResponse>("/curators");

  return response.data.data || [];
}

export async function getCuratorDetail(slug: string): Promise<CuratorDetail> {
  const response = await api.get<CuratorDetailResponse>(`/curator/${slug}`);

  return response.data.data.curator;
}
