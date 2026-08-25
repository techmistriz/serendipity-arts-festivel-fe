import type { Programme, ProgrammesListResponse, ProgramDetailResponse } from "@/types/programme";
import API, { METHODS } from "@/network/API";

//Fetch all programmes with pagination

export async function getProgrammes(page?: number, limit?: number): Promise<Programme[]> {
  const params: Record<string, number> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  try {
    const response = await API<ProgrammesListResponse>(
      "/programmes",
      METHODS.GET,
      Object.keys(params).length > 0 ? params : undefined,
    );

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch programmes");
    }

    // Handle paginated response
    if (response.data?.data) {
      return response.data.data;
    }

    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Fallback for unexpected format
    console.warn("[API] Unexpected response format:", response);
    return [];
  } catch (error) {
    console.error("[API] Error fetching programmes:", error);
    throw error;
  }
}

//Fetch program details by slug

export async function getProgrammeBySlug(slug: string): Promise<Programme> {
  if (!slug) {
    throw new Error("Program slug is required");
  }

  try {
    const response = await API<ProgramDetailResponse>(`/programme/${slug}`, METHODS.GET);

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch program details");
    }

    if (!response.data?.program) {
      throw new Error("Program not found");
    }

    return response.data.program;
  } catch (error) {
    console.error("[API] Error fetching programme detail:", error);
    throw error;
  }
}

//Fetch full program details with related data

export async function getProgrammeDetail(slug: string): Promise<ProgramDetailResponse> {
  if (!slug) {
    throw new Error("Program slug is required");
  }

  try {
    const response = await API<ProgramDetailResponse>(`/programme/${slug}`, METHODS.GET);

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch program details");
    }

    return response;
  } catch (error) {
    console.error("[API] Error fetching programme detail:", error);
    throw error;
  }
}
