export interface VibePartnerType {
  id: number;
  name: string;
}

export interface Vibe {
  id: number;
  parent_id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  featured_image: string | null;
  external_link: string | null;
  instagram_link: string | null;
  instagram_handle: string | null;
  partner_type_id: number;
  type: string | null;
  pdf: string | null;
  website_link: string | null;
  is_detail_page_allowed: number;
  ordering: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  background_color: string | null;
  text_color: string | null;
  webhook_status: number;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  partner_type: VibePartnerType;
}
