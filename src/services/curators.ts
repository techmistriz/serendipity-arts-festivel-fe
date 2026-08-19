import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface CuratorDiscipline {
  id: number;
  slug: string;
  name: string;
}

export interface CuratorListItem {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  curator_image: string | null;
  discipline: CuratorDiscipline | null;
}

export interface CuratorDetail extends CuratorListItem {
  bio: string | null;
  instagram_link: string | null;
  instagram_handle: string | null;
}

export interface CuratorProgram {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  } | null;
  program_details: Array<{
    event_date: string | null;
  }>;
}

export interface CuratorDetailData {
  curator: CuratorDetail;
  programs: CuratorProgram[];
}

function getSuccessfulData<T>(response: ApiResponse<T>, fallbackMessage: string): T {
  if (!response.status) {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
}

export async function getCurators(signal?: AbortSignal): Promise<CuratorListItem[]> {
  const response = await api.get<ApiResponse<CuratorListItem[]>>("/curators", { signal });

  return getSuccessfulData(response.data, "Unable to fetch curators.");
}

export async function getCuratorDetail(
  slug: string,
  signal?: AbortSignal,
): Promise<CuratorDetailData> {
  const response = await api.get<ApiResponse<CuratorDetailData>>(
    `/curator/${encodeURIComponent(slug)}`,
    { signal },
  );

  return getSuccessfulData(response.data, "Unable to fetch curator details.");
}
