import type { Metadata } from "next";
import WayfindingClient from "./WayfindingClient";

export const metadata: Metadata = {
  title: "Wayfinding — Serendipity Arts Festival 2026",
  description:
    "Find your way around Panjim: festival venues, streets, ferry and bus nodes, walking routes and directions.",
  openGraph: {
    title: "Wayfinding — Serendipity Arts Festival 2026",
    description:
      "A map of festival venues across Panjim, with walking routes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <WayfindingClient />;
}