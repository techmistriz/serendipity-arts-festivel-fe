"use client";

import { BookingSuccess } from "@/src/components/common/BookingSuccess";
import { useCart } from "@/src/lib/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function CartPage() {
  const {
    items,
    remove,
    setQty,
    subtotal,
    isRegistered,
    isLoggedIn,
    confirmBooking,
    isVip,
  } = useCart();

  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);

  const checkout = () => {
    if (!isRegistered) {
      router.push("/register?next=/cart");
      return;
    }

    if (!isLoggedIn) {
      router.push("/login?next=/cart");
      return;
    }

    setShowSuccess(true);
  };

  const finish = () => {
    confirmBooking();
    setShowSuccess(false);
    router.push("/dashboard");
  };

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="container-editorial pt-10 md:pt-24 pb-32">
        <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">Cart</h1>

        <p className="mt-8 text-muted-foreground max-w-md">
          Your cart is empty. Browse programmes and add the ones you want to book.
        </p>

        <Link href="/programmes" className="mt-8 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
          Browse programmes →
        </Link>
      </div>
    );
  }

  const gate = !isRegistered
    ? {
      label: "Register first to complete your booking.",
      cta: "Register →",
      to: "/register",
    }
    : !isLoggedIn
      ? {
        label: "You're registered — log in to continue to checkout.",
        cta: "Log in →",
        to: "/login",
      }
      : null;

  return (
    <div className="container-editorial pt-10 md:pt-24 pb-32">
      <h1 className="display uppercase text-[15vw] md:text-[12vw] leading-[0.9]">
        Cart
      </h1>

      {isVip && (
        <p className="mt-6 headline text-sm uppercase tracking-[0.06em] border border-accent text-accent inline-block px-3 py-2">
          Special guest access · All programmes complimentary
        </p>
      )}

      {gate && (
        <div className="mt-8 rule-t rule-b py-5 px-4 md:px-6 bg-muted flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="label">{gate.label}</p>

          <Link
            href={`${gate.to}?next=/cart`}
            className="label bg-foreground text-background rounded-full px-5 py-2 hover:bg-accent transition-colors w-fit"
          >
            {gate.cta}
          </Link>
        </div>
      )}

      <ul className="mt-10 md:mt-14 rule-t">
        {items.map((it) => (
          <li
            key={it.id}
            className="rule-b py-5 md:py-6 grid grid-cols-[64px_1fr_auto] md:grid-cols-[96px_1fr_auto_auto] items-center gap-4 md:gap-6"
          >
            <Image
              src={it.img}
              alt={it.title}
              width={96}
              height={96}
              className="h-16 w-16 md:h-24 md:w-24 object-cover"
            />

            <div className="min-w-0">
              <h3 className="headline font-semibold text-base md:text-xl break-words">
                {it.title}
              </h3>

              <p className="text-xs md:text-sm text-muted-foreground headline truncate">
                {it.date} · {it.venue}
              </p>

              <p className="text-xs md:text-sm text-muted-foreground">
                {it.price === 0 ? "Free" : `₹${it.price}`}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setQty(it.id, it.qty - 1)}
                className="headline font-semibold text-xl w-8"
              >
                −
              </button>

              <span className="headline font-semibold text-xl tabular-nums w-6 text-center">
                {it.qty}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQty(it.id, Math.min(isVip ? 2 : 6, it.qty + 1))
                }
                className="headline font-semibold text-xl w-8"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => remove(it.id)}
              className="label text-muted-foreground hover:text-accent col-span-3 md:col-span-1 justify-self-end"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rule-t pt-6">
        <div>
          <p className="label text-muted-foreground">Subtotal</p>

          <p className="display text-4xl md:text-6xl tabular-nums">
            ₹{subtotal}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <Link
            href="/programmes"
            className="headline uppercase tracking-[0.06em] text-sm md:text-base border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
          >
            + Add more programmes
          </Link>

          <button
            type="button"
            onClick={checkout}
            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors"
          >
            {gate ? gate.cta : "Continue to checkout →"}
          </button>
        </div>
      </div>

      {showSuccess && <BookingSuccess onClose={finish} />}
    </div>
  );
}