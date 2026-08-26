export interface WishlistProgramme {
  programmeId: string;
  program?: {
    name: string;
    slug: string;
    category: {
      name: string;
      font_color: string;
      background_color: string;
    };
    program_details: Array<{
      event_date: string;
      from_time: string;
      venue: {
        title: string;
      } | null;
    }>;
  };
}

export interface WishlistState {
  programmeIds: string[];
  programmes: WishlistProgramme[];
  loading: boolean;
  error: string | null;
  synced: boolean;
}

interface WishlistApiItem {
  program_id: string | number;
  program?: WishlistProgramme["program"];
}

export interface WishlistResponse {
  status: boolean;
  data: WishlistApiItem[];
  message?: string;
}

export interface WishlistAddResponse {
  status: boolean;
  message?: string;
  data?: WishlistApiItem;
}

export interface WishlistRemoveResponse {
  status: boolean;
  message?: string;
}
