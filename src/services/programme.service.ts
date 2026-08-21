import type { Programme, ProgrammesResponse } from "@/types/programme";
import API, { METHODS } from "@/network/API";

export async function getProgrammes(page?: number, limit?: number): Promise<Programme[]> {
  const params: Record<string, number> = {};

  if (page) {
    params.page = page;
  }

  if (limit) {
    params.limit = limit;
  }

  const response = await API<ProgrammesResponse>(
    "/programmes",
    METHODS.GET,
    Object.keys(params).length > 0 ? params : undefined,
  );

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch programmes");
  }

  console.log("programmes", response.data);

  return response.data;
}
