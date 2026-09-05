import { siteConfig } from "@/config/site";

function resolveHttpMediaUrl(path: string, baseUrl: string): string | null {
  try {
    const url = new URL(path, baseUrl);

    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/**
 * Resolves a media URL returned by the API without trusting non-HTTP schemes.
 * Laravel's local disk returns a relative `/storage/...` path, while production
 * storage returns an absolute CDN URL.
 */
export function resolveApiMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  try {
    const apiOrigin = new URL(siteConfig.api_base_url).origin;

    return resolveHttpMediaUrl(path, apiOrigin);
  } catch {
    return null;
  }
}

/**
 * Resolves a filename or path stored in the uploads CDN. A trailing slash is
 * retained on the base so a bare filename is appended instead of replacing the
 * final directory segment.
 */
export function resolveCdnMediaUrl(
  path: string | null | undefined,
  directory?: string,
): string | null {
  if (!path) return null;

  try {
    const cdnUrl = new URL(siteConfig.cdn_base_url);
    const normalizedDirectory = directory?.replace(/^\/+|\/+$/g, "");
    const basePath = [cdnUrl.pathname.replace(/\/+$/, ""), normalizedDirectory]
      .filter(Boolean)
      .join("/");
    const baseUrl = new URL(basePath ? `${basePath}/` : "/", cdnUrl.origin).toString();

    return resolveHttpMediaUrl(path, baseUrl);
  } catch {
    return null;
  }
}
