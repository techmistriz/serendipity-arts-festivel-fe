import API, { METHODS } from "@/network/API";

export interface SearchCurator {
  id: number;
  name: string;
  slug?: string;
  discipline?: string;
}

export interface SearchProgram {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  program_image?: string;
  category_id?: number;
  venue_id?: number | null;
}

export interface SearchVenue {
  id: number;
  name: string;
  slug?: string;
}

export interface SearchVibe {
  id: number;
  name: string;
}

export interface SearchResponse {
  status: boolean;
  data: {
    keyword: string;
    curators: SearchCurator[];
    programs: SearchProgram[];
    venues: SearchVenue[];
    vibes: SearchVibe[];
  };
  meta: string;
  message: string;
}

export async function searchSiteApi(keyword: string): Promise<SearchResponse["data"]> {
  const response = await API<SearchResponse>("/search", METHODS.GET, { keyword });

  if (!response.status) {
    throw new Error(response.message || "Search failed");
  }

  return response.data;
}
