export interface RegisterPayload {
  name: string;
  email: string;
  gender: string;

  country_id: number;
  state_id: number;
  city_id: number;

  std_code: string;
  contact: string;
  otp: string;

  role_id: number; // Hidden field

  referrer: string;
  interest: string;
  hearabout: string;

  subscribe: number;

  age_group: string;

  visited: string;
  visited_year: number[];

  custom_city: string;

  is_old_user: number;

  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;

  terms: boolean;
}