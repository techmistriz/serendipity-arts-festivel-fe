import { CheckoutPageClient } from "./CheckoutPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your Serendipity Arts Festival programme booking.",
  pathname: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
