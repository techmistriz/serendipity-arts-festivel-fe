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

export interface ApiResponse<T = any> {
  status: any;
  success: boolean;
  message: string;
  data: T;
}

export interface ArchiveUserPayload {
  email: string;
  role_id: number;
}
