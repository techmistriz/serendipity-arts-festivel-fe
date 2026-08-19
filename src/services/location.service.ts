import api from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface LocationOption {
  id: number;
  name: string;
  country_id?: number;
  state_id?: number;
}

type LocationsResponse = ApiResponse<LocationOption[]>;

export const getCountries = async (): Promise<LocationOption[]> => {
  const { data } = await api.get<LocationsResponse>("/countries");
  return data.data;
};

export const getStates = async (): Promise<LocationOption[]> => {
  const { data } = await api.get<LocationsResponse>("/states");
  return data.data;
};

export const getCities = async (): Promise<LocationOption[]> => {
  const { data } = await api.get<LocationsResponse>("/cities");
  return data.data;
};
