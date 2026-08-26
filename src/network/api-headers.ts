export function getPublicApiHeaders() {
  return {
    Accept: "application/json",
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
