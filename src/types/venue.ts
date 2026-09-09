import type { ApiResponse } from "./api";

export type Access = {
  id: number;
  name: string;
  icon: string;
  description: string;
};

export interface VenueListItem {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  featured_image: string | null;
  accessibility: Access[];
}

export interface VenueProgramDetail {
  id: number;
  program_id: number;
  event_date: string | null;
  from_time: string | null;
  to_time: string | null;
  program: {
    id: number;
    name: string;
    slug: string;
    category: {
      id: number;
      name: string;
    } | null;
    curators: Array<{
      id: number;
      name: string;
    }>;
  };
}

export interface VenueChild extends VenueListItem {
  program_details: VenueProgramDetail[];
  google_map_url: string | null;
}

export interface VenueDetail extends VenueListItem {
  meta_title: string | null;
  meta_keywords: string | null;
  meta_description: string | null;
  google_map_url: string | null;
  childs: VenueChild[];
  program_details: VenueProgramDetail[];
}

export type Venue = VenueListItem;

export type VenuesResponse = ApiResponse<VenueListItem[]>;
