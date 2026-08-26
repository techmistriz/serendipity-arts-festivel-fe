import { CartPageClient } from "./CartPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Cart",
  description: "Review your Serendipity Arts Festival programme bookings.",
  pathname: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return <CartPageClient />;
}
