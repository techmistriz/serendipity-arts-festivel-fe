"use client";

import { BookingSuccess } from "@/components/common/BookingSuccess";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import {
  cancelCheckout,
  createCheckout,
  type RazorpayCheckoutOptions,
  verifyCheckout,
} from "@/services/cart.service";
import { getErrorMessage } from "@/utils/error";

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailure = {
  error?: {
    description?: string;
  };
};

type RazorpayInstance = {
  open: () => void;
  on?: (event: "payment.failed", handler: (response: RazorpayPaymentFailure) => void) => void;
};

type RazorpayConstructor = new (
  options: RazorpayCheckoutOptions & {
    handler: (response: RazorpayPaymentResponse) => void;
    modal: { ondismiss: () => void };
  },
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const RAZORPAY_SCRIPT_ID = "razorpay-checkout-script";
let razorpayScriptPromise: Promise<RazorpayConstructor> | null = null;

function loadRazorpay(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    let existingScript = document.getElementById(RAZORPAY_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript?.dataset.loadState === "error") {
      existingScript.remove();
      existingScript = null;
    }

    const script = existingScript ?? document.createElement("script");

    const onLoad = () => {
      script.dataset.loadState = "loaded";

      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }

      razorpayScriptPromise = null;
      reject(new Error("Razorpay failed to initialise."));
    };
    const onError = () => {
      script.dataset.loadState = "error";
      razorpayScriptPromise = null;
      reject(new Error("Unable to load Razorpay checkout."));
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });

    if (!existingScript) {
      script.id = RAZORPAY_SCRIPT_ID;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return razorpayScriptPromise;
}

async function openRazorpayCheckout(
  options: RazorpayCheckoutOptions,
): Promise<RazorpayPaymentResponse> {
  const Razorpay = await loadRazorpay();

  return new Promise((resolve, reject) => {
    let settled = false;
    const resolveOnce = (response: RazorpayPaymentResponse) => {
      if (settled) return;

      settled = true;
      resolve(response);
    };
    const rejectOnce = (message: string) => {
      if (settled) return;

      settled = true;
      reject(new Error(message));
    };
    const checkout = new Razorpay({
      ...options,
      handler: resolveOnce,
      modal: {
        ondismiss: () => rejectOnce("Payment was cancelled."),
      },
    });

    checkout.on?.("payment.failed", (response) => {
      rejectOnce(
        response.error?.description ?? "Payment failed. Please try another payment method.",
      );
    });
    checkout.open();
  });
}

export function CartPageClient() {
  const { items, remove, setQty, subtotal, refresh, isComplimentary, isVip, loading, error } =
    useCart();

  const { isAuthenticated, user } = useAuth();

  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const checkout = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login?next=/cart");
      return;
    }

    setCheckoutError(null);
    setCheckoutLoading(true);
    let orderId: number | null = null;
    let paymentSubmitted = false;

    try {
      const checkoutResult = await createCheckout({ name: user.name, email: user.email });
      orderId = checkoutResult.order.id;

      if (!checkoutResult.paymentGateway) {
        await refresh(true);
        setShowSuccess(true);
        return;
      }

      if (checkoutResult.paymentGateway.name !== "RAZORPAY") {
        throw new Error("This payment method is not supported by the website yet.");
      }

      const payment = await openRazorpayCheckout(checkoutResult.paymentGateway.checkout);
      paymentSubmitted = true;

      await verifyCheckout({
        orderId: checkoutResult.order.id,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });

      await refresh(true);
      setShowSuccess(true);
    } catch (checkoutFailure) {
      if (orderId && !paymentSubmitted) {
        await cancelCheckout(orderId).catch(() => undefined);
      }

      setCheckoutError(
        paymentSubmitted
          ? "Your payment was received and is being confirmed. Please check your bookings shortly before trying again."
          : getErrorMessage(checkoutFailure, "Unable to complete checkout."),
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  const finish = () => {
    setShowSuccess(false);
    router.push("/dashboard");
  };

  const payableSubtotal = isComplimentary ? 0 : subtotal;

  if (loading && items.length === 0 && !showSuccess) {
    return (
      <div className="container-editorial pt-10 md:pt-24 pb-32">
        <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">Cart</h1>
        <p className="mt-8 text-muted-foreground">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="container-editorial pt-10 md:pt-24 pb-32">
        <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">Cart</h1>

        <p className="mt-8 text-muted-foreground max-w-md">
          Your cart is empty. Browse programmes and add the ones you want to book.
        </p>

        <Link
          href="/programmes"
          className="mt-8 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
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
        to: "/login",
      }
    : null;

  return (
    <div className="container-editorial pt-12 md:pt-24 pb-32">
      <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">Cart</h1>

      {isComplimentary && (
        <p className="mt-6 headline text-sm uppercase tracking-[0.06em] border border-accent text-accent inline-block px-3 py-2">
          {isVip
            ? "Special guest access · All programmes complimentary"
            : "Delegate access · All programmes complimentary"}
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

      {(checkoutError || error) && (
        <p className="mt-6 border border-red-600 px-4 py-3 text-sm text-red-600">
          {checkoutError ?? error}
        </p>
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
                {isComplimentary || it.price === 0 ? "Complimentary" : `₹${it.price}`}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() =>
                  void setQty(it.id, it.qty - 1).catch((updateError) =>
                    setCheckoutError(
                      getErrorMessage(updateError, "Unable to update this cart item."),
                    ),
                  )
                }
                disabled={loading || checkoutLoading}
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
                  void setQty(it.id, Math.min(5, it.qty + 1)).catch((updateError) =>
                    setCheckoutError(
                      getErrorMessage(updateError, "Unable to update this cart item."),
                    ),
                  )
                }
                disabled={loading || checkoutLoading || it.qty >= 5}
                className="headline font-semibold text-xl w-8"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                void remove(it.id).catch((removeError) =>
                  setCheckoutError(
                    getErrorMessage(removeError, "Unable to remove this cart item."),
                  ),
                )
              }
              disabled={loading || checkoutLoading}
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

          <p className="display text-4xl md:text-6xl tabular-nums">₹{payableSubtotal.toFixed(2)}</p>
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
            onClick={() => void checkout()}
            disabled={checkoutLoading || loading}
            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checkoutLoading ? "Processing…" : gate ? gate.cta : "Continue to checkout →"}
          </button>
        </div>
      </div>

      {showSuccess && <BookingSuccess onClose={finish} />}
    </div>
  );
}
