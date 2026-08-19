export interface VenueListItem {
  id: number;
  title: string;
  description: string | null;
  featured_image: string | null;
}

export interface VenueChild extends VenueListItem {
  google_map_url: string | null;
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

export interface VenueDetail extends VenueListItem {
  google_map_url: string | null;
  childs: VenueChild[];
  program_details: VenueProgramDetail[];
}
