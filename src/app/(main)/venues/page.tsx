import { Metadata } from "next";
import VenuesPageClient from "./VenuesPageClient";

export const metadata: Metadata = {
  title: "Venues — Serendipity Arts Festival 2026",
  description: "Heritage buildings and purpose-built festival spaces across Panjim.",
};

export default function Page() {
  return <VenuesPageClient />;
}
