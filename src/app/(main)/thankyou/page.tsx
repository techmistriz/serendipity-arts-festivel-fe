import { Suspense } from "react";
import { ThankYouPageClient } from "./ThankYouPageClient";

export default function ThankYouPage() {
  return (
    <Suspense fallback={null}>
      <ThankYouPageClient />
    </Suspense>
  );
}
