import type { Programme, ProgrammesListResponse, ProgramDetailResponse } from "@/types/programme";
import API, { METHODS } from "@/network/API";

export type ProgrammeClassificationFilters = {
  categorySlugs?: string[];
  disciplineSlugs?: string[];
  classificationMatch?: "any" | "all";
  is_dropping_type?: number;
};

//Fetch all programmes with pagination

export async function getProgrammes(
  page?: number,
  limit?: number,
  filters?: ProgrammeClassificationFilters,
): Promise<Programme[]> {
  const params: Record<string, number | string> = {};

  if (page) params.page = page;
  if (limit) params.limit = limit;

  if (filters?.categorySlugs?.length) {
    params.category_slug = filters.categorySlugs.join(",");
  }

  if (filters?.disciplineSlugs?.length) {
    params.discipline_slug = filters.disciplineSlugs.join(",");
  }

  if (filters?.classificationMatch) {
    params.classification_match = filters.classificationMatch;
  }

  if (filters?.is_dropping_type !== undefined) {
    params.is_dropping_type = filters.is_dropping_type;
  }

  try {
    const response = await API<ProgrammesListResponse>(
      "/programmes",
      METHODS.GET,
      Object.keys(params).length > 0 ? params : undefined,
    );

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch programmes");
    }

    if (response.data?.data) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.warn("[API] Unexpected response format:", response);
    return [];
  } catch (error) {
    console.error("[API] Error fetching programmes:", error);
    throw error;
  }
}

// --------------------------------------------------------------

export interface DroppingProgrammesResponse {
  programmes: Programme[];
  nearestDroppingSoonDate: string | null;
}

export async function getDroppingProgrammes(): Promise<DroppingProgrammesResponse> {
  try {
    const response = await API<ProgrammesListResponse>("/programmes", METHODS.GET, {
      is_dropping_type: 1,
    });

    if (!response.status) {
      throw new Error(response.message || "Failed to fetch dropping programmes");
    }

    return {
      programmes: response.data?.data ?? [],
      nearestDroppingSoonDate: response.meta?.nearest_dropping_soon_date ?? null,
    };
  } catch (error) {
    console.error("[API] Error fetching dropping programmes:", error);
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
