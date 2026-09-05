import WayfindingClient from "./WayfindingClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Wayfinding",
  description:
    "Find your way around Panjim: festival venues, streets, ferry and bus nodes, walking routes and directions.",
  pathname: "/wayfinding",
  keywords: ["festival map", "Panjim map", "Goa wayfinding", "festival directions"],
});

export default function Page() {
  return <WayfindingClient />;
}
