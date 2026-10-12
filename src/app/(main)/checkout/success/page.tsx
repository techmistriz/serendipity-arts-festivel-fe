"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookingSuccess } from "@/components/common/BookingSuccess";

function PurchaseTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const orderId = searchParams.get("order_id");
    const amountParam = searchParams.get("amount");
    const amount = Number(amountParam);

    if (!orderId || amountParam === null || !Number.isFinite(amount) || amount < 0) {
      return;
    }

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "purchase",
      transaction_id: orderId,
      value: amount,
      currency: "INR",
    });
  }, [searchParams]);

  return null;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PurchaseTracker />
      <BookingSuccess />
    </Suspense>
  );
}
