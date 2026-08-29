const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export function getPublicApiHeaders() {
  return {
    Accept: "application/json",
    ...(API_TOKEN ? { "X-API-TOKEN": API_TOKEN } : {}),
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
