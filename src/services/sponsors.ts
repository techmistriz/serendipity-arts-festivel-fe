import type { Sponsors, SponsorsResponse } from "@/types/sponsor";
import API, { METHODS } from "@/network/API";

export type SponsorsGrouped = Record<string, Sponsors[]>;

export async function getSponsors(
  limit?: number,
  groupBySponsorType = false,
): Promise<Sponsors[] | SponsorsGrouped> {
  const params = groupBySponsorType
    ? {
        group_by_sponsor_type: "YES",
      }
    : {
        sponsor_type_id: 3,
        ...(limit ? { limit } : {}),
      };

  console.log("Sponsors API params:", params);

  const response = await API<SponsorsResponse>("/sponsors", METHODS.GET, params);

  console.log("Sponsors API response:", response);
  console.log("Sponsors API response data:", response.data);

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch sponsors");
  }

  return response.data;
}
