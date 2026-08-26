import { WishlistDashboardPageClient } from "../WishlistDashboardPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "My Wishlist",
  description: "Manage saved Serendipity Arts Festival programmes.",
  pathname: "/dashboard/wishlist",
  noIndex: true,
});

export default function WishlistDashboardPage() {
  return <WishlistDashboardPageClient />;
}
