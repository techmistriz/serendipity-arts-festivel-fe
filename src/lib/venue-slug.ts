export function goaVenueSlug(venue: string) {
  const value = venue.toLowerCase();

  if (value.includes("gmc")) return "old-gmc";
  if (value.includes("esg")) return "esg";
  if (value.includes("art park")) return "art-park";
  if (value.includes("promenade")) return "promenade";
  if (value.includes("db") || value.includes("arena")) return "db-ground";
  if (value.includes("samba")) return "samba-square";
  if (value.includes("accounts") || value.includes("directorate")) return "accounts";

  return undefined;
}
