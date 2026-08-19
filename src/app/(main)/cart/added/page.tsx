"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useCart } from "@/context/cart-context";

export default function Added() {
  return (
    <Suspense fallback={<AddedLoading />}>
      <AddedContent />
    </Suspense>
  );
}

function AddedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") ?? "";

  const { items } = useCart();

  const item = items.find((i) => i.id === id) ?? items[items.length - 1];

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
        <button
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

function AddedLoading() {
  return (
    <div>
      <h1>Added to cart</h1>
      <p>Loading...</p>
    </div>
  );
}
