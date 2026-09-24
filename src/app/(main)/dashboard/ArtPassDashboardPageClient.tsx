"use client";

import Image from "next/image";
import { Download } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

import { DashboardShell } from "./DashboardShell";

export function ArtPassDashboardPageClient() {
  return (
    <DashboardShell>
      <ArtPassContent />
    </DashboardShell>
  );
}

function ArtPassContent() {
  const { user } = useAuth();
  const badgeUrl = user?.badge;

  const handleDownload = async () => {
    if (!badgeUrl) return;

    try {
      const response = await fetch(badgeUrl);

      if (!response.ok) {
        throw new Error("Failed to download Art Pass");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "serendipity-arts-festival-art-pass.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Art Pass download failed:", error);

      // Fallback: open the image
      window.open(badgeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-2xl">
      <p className="label text-muted-foreground">Your festival pass</p>

      <h2 className="mt-2 display text-3xl leading-none uppercase md:text-4xl">Art Pass</h2>

      {badgeUrl ? (
        <div className="mt-10">
          <div className="relative aspect-[3/4] w-full max-w-md border border-foreground bg-muted p-3 md:p-5">
            <Image
              src={badgeUrl}
              alt="Your Serendipity Arts Festival Art Pass"
              fill
              className="object-contain p-3 md:p-5"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="label mt-6 inline-flex items-center gap-2 border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Art Pass
          </button>
        </div>
      ) : (
        <p className="label mt-10 border border-foreground p-6 text-muted-foreground">
          Your Art Pass is not available yet.
        </p>
      )}
    </div>
  );
}
