export interface SendOTPRequest {
  email: string;
  contact: string;
  std_code: string;
}

export interface GeneralRegisterRequest {
  name: string;
  email: string;
  gender: string;
  country_id: string;
  state_id: string;
  city_id: string;
  std_code: string;
  contact: string;
  otp: string;
  age_group: string;
  interest: string[];
  hearabout: string;
  subscribe: boolean;
  visited: string;
  visited_year: string[];
  terms: boolean;
}

export interface GuestRegisterRequest {
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
  is_old_user: boolean;
}

export interface SEARequest {
  name: string;
  email: string;
  gender: string;
  country_id: string;
  state_id: string;
  city_id: string;
  std_code: string;
  contact: string;
  otp: string;
}

export interface ApiResponse<T = any> {
  status: any;
  success: boolean;
  message: string;
  data: T;
}