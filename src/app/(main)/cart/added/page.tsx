"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useCart } from "@/src/lib/cart";

export default function Added() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") ?? "";

  const { items } = useCart();

  const item =
    items.find((i) => i.id === id) ?? items[items.length - 1];

  return (
    <div>
      <h1>Added to cart</h1>

      <p>Added to your cart.</p>

      {item ? (
        <p>
          {item.title} — {item.date} at {item.time}.
        </p>
      ) : (
        <p>Your programme is in your cart.</p>
      )}

      <div className="mt-12 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => router.push("/programmes")}
          className="headline text-sm uppercase tracking-[0.06em] border border-foreground px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
        >
          + Add more programmes
        </button>

        <Link
          href="/cart"
          className="headline text-sm uppercase tracking-[0.06em] bg-foreground text-background rounded-full px-6 py-4 hover:bg-accent transition-colors"
        >
          Continue to checkout →
        </Link>
      </div>
    </div>
  );
}