import DOMPurify from "dompurify";

const RICH_TEXT_ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "em",
  "h2",
  "h3",
  "i",
  "li",
  "ol",
  "p",
  "strong",
  "ul",
];

export function stripHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

/** Sanitizes CMS rich text using the application's intentionally small HTML allowlist. */
export function sanitizeRichText(html: string): string {
  return String(
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
      ALLOWED_ATTR: ["href"],
    }),
  );
}
