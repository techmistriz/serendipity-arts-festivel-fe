export const API_TOKEN = "bb15a7d7d24c13088ae34fb19db7b0f5d064d315be568b4ce0c01106a061deea";

export function getPublicApiHeaders() {
  return {
    Accept: "application/json",
    "X-API-TOKEN": API_TOKEN,
  };
}

export function getApiHeaders(payload: unknown, authToken: string | null) {
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  return {
    ...getPublicApiHeaders(),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}
