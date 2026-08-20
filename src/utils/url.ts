/** Returns a valid external HTTPS URL, or `null` for an unsafe or malformed value. */
export function getSafeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    return parsedUrl.protocol === "https:" ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}
