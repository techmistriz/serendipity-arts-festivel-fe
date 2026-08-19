import API, { METHODS } from "@/network/API";

export interface LaunchFilm {
  id: number;
  year: string;
  youtube_video_id: string;
}

interface LaunchFilmsResponse {
  status: boolean;
  data: LaunchFilm[];
  meta: string;
  message: string;
}

export async function getLaunchFilms(): Promise<LaunchFilm[]> {
  const response = await API<LaunchFilmsResponse>("/launch-films", METHODS.GET);

  if (!response.status) {
    throw new Error(response.message || "Failed to fetch launch films");
  }

  return response.data;
}
