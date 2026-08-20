import { siteConfig } from "@/config/site";

/**
 * Resolves a media URL returned by the API without trusting non-HTTP schemes.
 * Laravel's local disk returns a relative `/storage/...` path, while production
 * storage returns an absolute CDN URL.
 */
export function resolveApiMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  try {
    const apiOrigin = new URL(siteConfig.api_base_url).origin;
    const url = new URL(path, apiOrigin);

    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
