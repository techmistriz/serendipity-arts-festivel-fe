"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getErrorMessage } from "@/utils/error";

export function CartPageClient() {
  const { items, remove, setQty, subtotal, isComplimentary, isVip, loading, error } = useCart();
  const { isAuthenticated } = useAuth();
  const [cartActionError, setCartActionError] = useState<string | null>(null);
  const payableSubtotal = isComplimentary ? 0 : subtotal;

  if (loading && items.length === 0) {
    return (
      <div className="container-editorial pt-10 pb-32 md:pt-24">
        <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Cart</h1>
        <p className="mt-8 text-muted-foreground">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-editorial pt-10 pb-32 md:pt-24">
        <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Cart</h1>
        <p className="mt-8 max-w-md text-muted-foreground">
          Your cart is empty. Browse programmes and add the ones you want to book.
        </p>
        <Link
          href="/programmes"
          className="label mt-8 inline-block border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Browse programmes →
        </Link>
      </div>
    );
  }

  const gate = !isAuthenticated
    ? {
        label: "Log in to continue to checkout.",
        cta: "Log in →",
        to: "/login?next=/checkout",
      }
    : null;

  return (
    <div className="container-editorial pt-12 pb-32 md:pt-24">
      <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Cart</h1>

      {isComplimentary && (
        <p className="headline mt-6 inline-block border border-accent px-3 py-2 text-sm uppercase tracking-[0.06em] text-accent">
          {isVip
            ? "Special guest access · All programmes complimentary"
            : "Delegate access · All programmes complimentary"}
        </p>
      )}

      {gate && (
        <div className="rule-t rule-b mt-8 flex flex-col gap-3 bg-muted px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="label">{gate.label}</p>
          <Link
            href={gate.to}
            className="label w-fit rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-accent"
          >
            {gate.cta}
          </Link>
        </div>
      )}

      {(cartActionError || error) && (
        <p className="mt-6 border border-red-600 px-4 py-3 text-sm text-red-600">
          {cartActionError ?? error}
        </p>
      )}

      <ul className="rule-t mt-10 md:mt-14">
        {items.map((item) => (
          <li
            key={item.id}
            className="rule-b grid grid-cols-[64px_1fr_auto] items-center gap-4 py-5 md:grid-cols-[96px_1fr_auto_auto] md:gap-6 md:py-6"
          >
            <Image
              src={item.img}
              alt={item.title}
              width={96}
              height={96}
              className="h-16 w-16 object-cover md:h-24 md:w-24"
            />
            <div className="min-w-0">
              <h3 className="headline break-words text-base font-semibold md:text-xl">
                {item.title}
              </h3>
              <p className="headline truncate text-xs text-muted-foreground md:text-sm">
                {item.date} · {item.venue}
              </p>
              <p className="text-xs text-muted-foreground md:text-sm">
                {isComplimentary || item.price === 0 ? "Complimentary" : `₹${item.price}`}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() =>
                  void setQty(item.id, item.qty - 1).catch((updateError) =>
                    setCartActionError(
                      getErrorMessage(updateError, "Unable to update this cart item."),
                    ),
                  )
                }
                disabled={loading}
                className="headline w-8 text-xl font-semibold"
              >
                −
              </button>
              <span className="headline w-6 text-center text-xl font-semibold tabular-nums">
                {item.qty}
              </span>
              <button
                type="button"
                onClick={() =>
                  void setQty(item.id, Math.min(5, item.qty + 1)).catch((updateError) =>
                    setCartActionError(
                      getErrorMessage(updateError, "Unable to update this cart item."),
                    ),
                  )
                }
                disabled={loading || item.qty >= 5}
                className="headline w-8 text-xl font-semibold"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                void remove(item.id).catch((removeError) =>
                  setCartActionError(
                    getErrorMessage(removeError, "Unable to remove this cart item."),
                  ),
                )
              }
              disabled={loading}
              className="label col-span-3 justify-self-end text-muted-foreground hover:text-accent md:col-span-1"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="rule-t mt-10 flex flex-col gap-6 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label text-muted-foreground">Subtotal</p>
          <p className="display text-4xl tabular-nums md:text-6xl">₹{payableSubtotal.toFixed(2)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link
            href="/programmes"
            className="headline border border-foreground px-6 py-3 text-sm uppercase tracking-[0.06em] transition-colors hover:bg-foreground hover:text-background md:text-base"
          >
            + Add more programmes
          </Link>
          {loading ? (
            <span className="headline rounded-full bg-muted px-8 py-4 text-lg font-semibold uppercase md:text-xl">
              Updating cart…
            </span>
          ) : (
            <Link
              href={isAuthenticated ? "/checkout" : "/login?next=/checkout"}
              className="headline rounded-full bg-foreground px-8 py-4 text-lg font-semibold uppercase text-background transition-colors hover:bg-accent md:text-xl"
            >
              {gate ? gate.cta : "Continue to checkout →"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
