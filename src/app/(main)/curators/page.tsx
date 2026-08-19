import { Metadata } from "next";
import CuratorsClient from "./CuratorsClient";

export const metadata: Metadata = {
  title: "Curators — Serendipity Arts Festival 2026",
  description:
    "The artists, scholars and practitioners shaping the 2026 edition — across Accessibility, Culinary Arts, Music, Dance, Theatre, Craft, Visual Arts and Special Projects.",
};

export default function Page() {
  return <CuratorsClient />;
}
