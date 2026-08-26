export interface SendOTPRequest {
  email: string;
  contact: string;
  std_code: string;
}

export interface GeneralRegisterRequest {
  role_id: number;
  name: string;
  email: string;
  gender: string;
  country_id: number;
  state_id: number;
  city_id: number;
  std_code: string;
  contact: string;
  otp: string;
  age_group: string;
  interest: string[];
  hearabout: string;
  subscribe: 0 | 1;
  visited: string;
  visited_year: string[];
  terms: boolean;
  is_old_user: 0 | 1;
}

export interface GuestRegisterRequest {
  role_id: number;
  name: string;
  email: string;
  contact: string;
  std_code: string;
  dates: string[];
  travel: string;
  boarding: string;
  accomodation_assistance_required: string;
  accompanied_anyone: string;
  accompanied_persons: string;
  additional_requests: string;
  is_old_user: 0 | 1;
  subscribe: 0 | 1;
}

export interface SEARequest {
  role_id: number;
  name: string;
  email: string;
  gender: string;
  country_id: number;
  state_id: number;
  city_id: number;
  std_code: string;
  contact: string;
  otp: string;
  subscribe: 0 | 1;
  terms: boolean;
  is_old_user: 0 | 1;
}

export interface LocationItem {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;

  std_code?: string;
  contact?: string;

  role_id?: number;
  role?: {
    id: number;
    name: string;
    role_code?: string;
  };

  referrer?: string;

  gender: string;
  age_group: string;

  country_id: number | null;
  country?: LocationItem | null;

  state_id: number | null;
  state?: LocationItem | null;

  city_id: number | null;
  city?: LocationItem | null;

  custom_city: string | null;

  interest: string[];
  hearabout: string;

  subscribe: number | boolean;

  visited: string;
  visited_year: string[];

  is_old_user?: boolean | number;

  organisation?: string | null;
  job_title?: string | null;
  media_type?: string | null;
  website?: string | null;

  dates?: string[];
  travel?: string | null;
  boarding?: string | null;
  accompanied_anyone?: string | null;
  accompanied_persons?: string | null;
  additional_requests?: string | null;
  accomodation_assistance_required?: string | null;

  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  [key: string]: unknown;
}

export interface AuthState {
  session: AuthSession | null;
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
