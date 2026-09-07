"use client";

import { Download } from "lucide-react";
import Image from "next/image";

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

  return (
    <div className="max-w-2xl">
      <p className="label text-muted-foreground">Your festival pass</p>
      <h2 className="mt-2 display text-3xl leading-none uppercase md:text-4xl">Art Pass</h2>

      {badgeUrl ? (
        <div className="mt-10">
          <div className="border border-foreground bg-muted p-3 md:p-5">
            <div className="relative mx-auto aspect-[3/4] max-h-[70vh] w-full">
              <Image
                src={badgeUrl}
                alt="Your Serendipity Arts Festival Art Pass"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 640px"
              />
            </div>
          </div>
          <a
            href={badgeUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="label mt-6 inline-flex items-center gap-2 border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Art Pass
          </a>
        </div>
      ) : (
        <p className="label mt-10 border border-foreground p-6 text-muted-foreground">
          Your Art Pass is not available yet.
        </p>
      )}
    </div>
  );
}
