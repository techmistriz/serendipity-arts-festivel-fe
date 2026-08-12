import api from "./axios";

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
  const response = await api.get<LaunchFilmsResponse>("/launch-films");

  if (!response.data.status) {
    throw new Error(
      response.data.message || "Failed to fetch launch films"
    );
  }

  return response.data.data;
}