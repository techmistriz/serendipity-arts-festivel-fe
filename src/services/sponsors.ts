import { Sponsors, SponsorsResponse } from "../types/sponsor";
import api from "./axios";


export async function getSponsors(limit?: number): Promise<Sponsors[]> {
  const response = await api.get<SponsorsResponse>("/sponsors", {
    params: limit ? { limit } : undefined,
  });

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch sponsors");
  }

  return response.data.data;
}