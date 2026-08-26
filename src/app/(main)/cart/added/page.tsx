import { Suspense } from "react";

import { AddedLoading, AddedToCartPageClient } from "./AddedToCartPageClient";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Added to Cart",
  description: "Your programme has been added to your cart.",
  pathname: "/cart/added",
  noIndex: true,
});

export default function AddedToCartPage() {
  return (
    <Suspense fallback={<AddedLoading />}>
      <AddedToCartPageClient />
    </Suspense>
  );
}
