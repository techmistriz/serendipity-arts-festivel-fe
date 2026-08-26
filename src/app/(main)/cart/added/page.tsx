import { Suspense } from "react";

import { AddedLoading, AddedToCartPageClient } from "./AddedToCartPageClient";

export default function AddedToCartPage() {
  return (
    <Suspense fallback={<AddedLoading />}>
      <AddedToCartPageClient />
    </Suspense>
  );
}
