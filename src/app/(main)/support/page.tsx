import type { Metadata } from "next";
import Support from "./Support";

export const metadata: Metadata = {
  title: "Support the Festival | Serendipity Arts Festival 2026",
  description:
    "Donate, sponsor, adopt a programme or give through CSR to Serendipity Arts Festival 2026, Panjim, Goa.",
  openGraph: {
    title: "Support Serendipity Arts Festival 2026",
    description: "Donate, sponsor a programme or partner with us through CSR.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SupportPage() {
  return <Support />;
}
