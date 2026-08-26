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
  "strong",
  "ul",
];

type CuratorBioProps = {
  bio: string | null;
};

export function CuratorBio({ bio }: CuratorBioProps) {
  const [sanitizedBio, setSanitizedBio] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!bio) {
      return;
    }

    void import("dompurify").then(({ default: DOMPurify }) => {
      if (!cancelled) {
        const purifier = typeof DOMPurify.sanitize === "function" ? DOMPurify : DOMPurify(window);

        setSanitizedBio(
          String(
            purifier.sanitize(bio, {
              ALLOWED_TAGS: allowedTags,
              ALLOWED_ATTR: ["href"],
            }),
          ),
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, [bio]);

  if (!sanitizedBio) return null;

  return (
    <div
      className="headline mt-6 max-w-prose space-y-4 text-base leading-relaxed md:text-lg [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
      dangerouslySetInnerHTML={{ __html: sanitizedBio }}
    />
  );
}
