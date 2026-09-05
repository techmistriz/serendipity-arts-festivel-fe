import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";

export interface LocationOption {
  id: number;
  name: string;
  country_id?: number;
  state_id?: number;
}

type LocationsResponse = ApiResponse<LocationOption[]>;

export const getCountries = async (): Promise<LocationOption[]> => {
  const response = await API<LocationsResponse>("/countries", METHODS.GET);
  return response.data;
};

export const getStates = async (countryId: number): Promise<LocationOption[]> => {
  const response = await API<LocationsResponse>("/states", METHODS.GET, {
    country_id: countryId,
  });
  return response.data;
};

export const getCities = async (stateId: number): Promise<LocationOption[]> => {
  const response = await API<LocationsResponse>("/cities", METHODS.GET, {
    state_id: stateId,
  });
  return response.data;
};
