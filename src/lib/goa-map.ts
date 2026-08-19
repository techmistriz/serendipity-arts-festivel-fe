// Wayfinding geometry for the Panjim festival footprint.

import { MapArea, MapNode, MapPoint, MapRoad } from "@/components/maps/wayfinding-map";

export const GOA_VENUE_POINTS: MapPoint[] = [
  {
    slug: "old-gmc",
    short: "Old GMC",
    name: "The Old GMC Complex",
    lat: 15.4968,
    lng: 73.8215,
    address: "Campal, Panjim, Goa",
  },
  {
    slug: "esg",
    short: "ESG",
    name: "ESG Building",
    lat: 15.4974,
    lng: 73.8206,
    address: "Campal, Panjim, Goa",
  },
  {
    slug: "art-park",
    short: "Art Park",
    name: "Art Park",
    lat: 15.4983,
    lng: 73.8232,
    address: "Campal, Panjim, Goa",
  },
  {
    slug: "promenade",
    short: "Promenade",
    name: "Promenade",
    lat: 15.4996,
    lng: 73.8256,
    address: "D. B. Marg, Panjim, Goa",
  },
  {
    slug: "db-ground",
    short: "Arena",
    name: "Arena at DB Ground",
    lat: 15.4941,
    lng: 73.8262,
    address: "Dr. Shyama Prasad Mukherjee Stadium, Panjim, Goa",
  },
  {
    slug: "samba-square",
    short: "Samba Square",
    name: "Samba Square",
    lat: 15.4986,
    lng: 73.8298,
    address: "Church Square, Panjim, Goa",
  },
  {
    slug: "accounts",
    short: "Accounts",
    name: "Directorate of Accounts",
    lat: 15.4979,
    lng: 73.8311,
    address: "Panjim, Goa",
  },
];

export const GOA_ROADS: MapRoad[] = [
  {
    name: "D. B. Marg",
    major: true,
    points: [
      [15.4966, 73.8203],
      [15.4985, 73.8236],
      [15.4998, 73.8262],
      [15.4993, 73.83],
    ],
  },
  {
    name: "Dayanand Bandodkar Rd",
    points: [
      [15.4941, 73.8262],
      [15.4962, 73.8258],
      [15.4982, 73.8252],
    ],
  },
  {
    name: "Church Square",
    points: [
      [15.4986, 73.8298],
      [15.4979, 73.8311],
      [15.4972, 73.8306],
    ],
  },
  {
    name: "Campal Rd",
    points: [
      [15.4968, 73.8215],
      [15.4974, 73.8206],
      [15.4983, 73.8232],
    ],
  },
];

export const GOA_AREAS: MapArea[] = [
  {
    name: "Mandovi River",
    kind: "water",
    points: [
      [15.5008, 73.819],
      [15.5012, 73.833],
      [15.5001, 73.833],
      [15.5, 73.819],
    ],
  },
  {
    name: "Campal Gardens",
    kind: "green",
    points: [
      [15.498, 73.8222],
      [15.499, 73.824],
      [15.4978, 73.8244],
      [15.497, 73.8228],
    ],
  },
];

export const GOA_NODES: MapNode[] = [
  { name: "Kadamba Bus Stand", kind: "bus", lat: 15.4948, lng: 73.8304 },
  { name: "Ferry Jetty", kind: "ferry", lat: 15.5003, lng: 73.8285 },
  { name: "Festival Info Desk", kind: "info", lat: 15.4984, lng: 73.8244 },
  { name: "Parking", kind: "parking", lat: 15.4952, lng: 73.8266 },
];

/** Match a programme’s venue string to a map point slug. */
export function goaVenueSlug(venue: string) {
  const v = venue.toLowerCase();
  if (v.includes("gmc")) return "old-gmc";
  if (v.includes("esg")) return "esg";
  if (v.includes("art park")) return "art-park";
  if (v.includes("promenade")) return "promenade";
  if (v.includes("db") || v.includes("arena")) return "db-ground";
  if (v.includes("samba")) return "samba-square";
  if (v.includes("accounts") || v.includes("directorate")) return "accounts";
  return undefined;
}
