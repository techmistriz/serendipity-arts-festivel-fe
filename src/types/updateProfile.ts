export type UpdateProfilePayload = {
  name: string;
  gender: string;
  age_group: string;
  country_id: number | null;
  state_id: number | null;
  city_id: number | null;
  custom_city: string;
  interest: string;
  hearabout: string;
  subscribe: number;
  visited: string;
  visited_year: string[];
};
