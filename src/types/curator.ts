export interface Curator {
  curator_image: import("next/image").StaticImageData;
  id: number;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
}

export interface CuratorsResponse {
  status: boolean;
  message?: string;
  data: Curator[];
}