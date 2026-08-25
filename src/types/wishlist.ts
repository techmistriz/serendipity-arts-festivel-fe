export interface WishlistItem {
  id: number;
  program_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_by: string | null;
  program?: {
    id: number;
    name: string;
    booking_type: string | null;
    program_type: string;
    slug: string;
    category_id: number;
    is_booking_allowed: number;
    category: {
      id: number;
      name: string;
      font_color: string;
      background_color: string;
    };
    program_details: Array<{
      id: number;
      program_id: number;
      venue_id: number;
      event_date: string;
      from_time: string;
      to_time: string;
      venue: {
        id: number;
        title: string;
      } | null;
    }>;
  };
}

export interface WishlistState {
  programmeIds: string[];
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  synced: boolean;
}

export interface WishlistResponse {
  status: boolean;
  data: WishlistItem[];
  programmeIds?: string[];
  message?: string;
}

export interface WishlistAddResponse {
  status: boolean;
  message?: string;
  data?: WishlistItem;
}

export interface WishlistRemoveResponse {
  status: boolean;
  message?: string;
}
