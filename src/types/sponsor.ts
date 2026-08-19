export interface SponsorType {
  id: number;
  name: string;
}

export interface Sponsors {
  id: number;
  name: string;
  sponsor_type_id: number;
  url: string;
  logo: string;
  ordering_number: number;
  hide_logo: number;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  description: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  webhook_status: number;
  webhook_response: string | null;
  sponsor_type: SponsorType;
}

export interface SponsorsResponse {
  status: boolean;
  data: Sponsors[];
  meta: string;
  message: string;
}
