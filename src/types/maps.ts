export type MapPoint = {
  slug: string;
  short: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
};

export type MapRoad = {
  name: string;
  points: [number, number][];
  major?: boolean;
};

export type MapArea = {
  name: string;
  kind: "water" | "green";
  points: [number, number][];
};

export type MapNode = {
  name: string;
  kind: "tube" | "rail" | "bus" | "parking" | "ferry" | "info";
  lat: number;
  lng: number;
};
