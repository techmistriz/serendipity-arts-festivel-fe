export interface Venue {
  title: string;
  featured_image: any;
  id: number;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
}

export interface VenuesResponse {
  status: boolean;
  message?: string;
  data: Venue[];
}