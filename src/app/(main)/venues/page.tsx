import { Metadata } from "next";
import { Suspense } from "react";
import VenuesClient from "./VenuesClient";

export const metadata: Metadata = {
  title: "Venues — Serendipity Arts Festival 2026",
  description: "Heritage buildings and purpose-built festival spaces across Panjim.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VenuesClient />
    </Suspense>
  );
}
