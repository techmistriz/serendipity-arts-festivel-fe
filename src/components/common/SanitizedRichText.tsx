"use client";

import { useEffect, useState } from "react";

const allowedTags = [
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
  "span",
  "strong",
  "ul",
];

const allowedAttributes = ["href", "style"];

type SanitizedRichTextProps = {
  html: string | null;
  className: string;
};

/** Renders CMS rich text after browser-side DOMPurify sanitisation. */
export function SanitizedRichText({ html, className }: SanitizedRichTextProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!html) {
      return;
    }

    void import("dompurify").then(({ default: DOMPurify }) => {
      if (!cancelled) {
        const purifier = typeof DOMPurify.sanitize === "function" ? DOMPurify : DOMPurify(window);

        setSanitizedHtml(
          String(
            purifier.sanitize(html, {
              ALLOWED_TAGS: allowedTags,
              ALLOWED_ATTR: allowedAttributes,
            }),
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [html]);

  if (!sanitizedHtml) return null;

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
