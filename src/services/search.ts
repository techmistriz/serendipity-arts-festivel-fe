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
  name?: string;
  title?: string;
  slug?: string;
}

export interface SearchVibe {
  id: number;
  parent_id: number;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  featured_image?: string;
  external_link?: string | null;
  instagram_link?: string | null;
}

export interface SearchResponse {
  status: boolean;
  data: {
    keyword: string;
    curators: SearchCurator[];
    programs: SearchProgram[];
    venues: SearchVenue[];
    vibes: Record<string, SearchVibe[]>;
  };
  meta: string;
  message: string;
}

export async function searchSiteApi(keyword: string): Promise<SearchResponse["data"]> {
  const response = await API<SearchResponse>("/search", METHODS.GET, {
    keyword,
  });

  if (!response.status) {
    throw new Error(response.message || "Search failed");
  }

  return response.data;
}
