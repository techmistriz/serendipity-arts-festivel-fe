"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useCart } from "@/hooks/use-cart";

export function AddedToCartPageClient() {
  const searchParams = useSearchParams();
  const addedItemId = searchParams.get("id");

  const { items } = useCart();
  const item = addedItemId ? items.find((cartItem) => cartItem.id === addedItemId) : undefined;

  return (
    <div className="container-editorial pt-16 md:pt-24 pb-32 min-h-[70vh]">
      <p className="label text-accent">Added to cart</p>
      <h1 className="display uppercase text-[13vw] md:text-[8vw] leading-[0.9] mt-3">
        Added to your cart.
      </h1>
      {item ? (
        <p className="mt-8 max-w-2xl headline text-lg md:text-xl text-muted-foreground">
          <span className="text-foreground">{item.title}</span> — {item.date} at {item.time}.
        </p>
      ) : (
        <p className="mt-8 max-w-2xl headline text-lg text-muted-foreground">
          Your programme is in your cart.
        </p>
      )}

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/programmes"
          className="headline text-sm uppercase tracking-[0.06em] border border-foreground px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
        >
          + Add more programmes
        </Link>
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

export function AddedLoading() {
  return (
    <div className="container-editorial min-h-[70vh] pt-16 pb-32 md:pt-24" aria-busy="true">
      <p className="label text-accent">Added to cart</p>
      <h1 className="display mt-3 uppercase text-[13vw] leading-[0.9] md:text-[8vw]">
        Loading your cart.
      </h1>
    </div>
  );
}
