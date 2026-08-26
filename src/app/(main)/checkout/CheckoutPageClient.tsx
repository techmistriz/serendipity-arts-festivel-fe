"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { BookingSuccess } from "@/components/common/BookingSuccess";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import {
  cancelCheckout,
  createCheckout,
  validateCheckoutCoupon,
  verifyCheckout,
  type CouponValidation,
} from "@/services/cart.service";
import { openRazorpayCheckout } from "@/services/razorpay.service";
import { getErrorMessage } from "@/utils/error";
import { formatCurrency } from "@/utils/format";

export function CheckoutPageClient() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { items, subtotal, refresh, isComplimentary, isVip, loading, error } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const payableSubtotal = isComplimentary ? 0 : subtotal;
  const orderSubtotal = appliedCoupon?.subtotal ?? payableSubtotal;
  const couponDiscount = appliedCoupon?.discount ?? 0;
  const total = appliedCoupon?.total ?? payableSubtotal;

  const applyCoupon = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = couponCode.trim();

    if (!code) {
      setCouponError("Enter a coupon code first.");
      return;
    }

    setCouponError(null);
    setIsApplyingCoupon(true);

    try {
      const coupon = await validateCheckoutCoupon(code);
      setAppliedCoupon(coupon);
      setCouponCode(coupon.coupon.code);
    } catch (applyError) {
      setAppliedCoupon(null);
      setCouponError(getErrorMessage(applyError, "Unable to apply this coupon."));
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const checkout = async () => {
    if (!user) return;

    setCheckoutError(null);
    setIsCheckingOut(true);
    let orderId: number | null = null;
    let paymentSubmitted = false;

    try {
      const checkoutResult = await createCheckout({
        name: user.name,
        email: user.email,
        couponCode: appliedCoupon?.coupon.code,
      });
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
      setIsCheckingOut(false);
    }
  };

  if (authLoading || (loading && items.length === 0 && !showSuccess)) {
    return (
      <div className="container-editorial pt-10 pb-32 md:pt-24">
        <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Checkout</h1>
        <p className="mt-8 text-muted-foreground">Loading checkout…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container-editorial pt-10 pb-32 md:pt-24">
        <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Checkout</h1>
        <p className="mt-8 max-w-md text-muted-foreground">
          Please log in to complete your booking.
        </p>
        <Link
          href="/login?next=/checkout"
          className="label mt-8 inline-block border border-foreground px-6 py-3 transition-colors hover:bg-foreground hover:text-background"
        >
          Log in →
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !showSuccess) {
    return (
      <div className="container-editorial pt-10 pb-32 md:pt-24">
        <h1 className="display text-[14vw] leading-[0.9] uppercase md:text-[10vw]">Checkout</h1>
        <p className="mt-8 max-w-md text-muted-foreground">
          There are no programmes in your cart yet.
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

  return (
    <div className="container-editorial pt-12 pb-32 md:pt-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="label text-muted-foreground">One final step</p>
          <h1 className="display mt-2 text-[14vw] leading-[0.9] uppercase md:text-[10vw]">
            Checkout
          </h1>
        </div>
        <Link
          href="/cart"
          className="label border-b border-foreground pb-1 hover:border-accent hover:text-accent"
        >
          ← Edit cart
        </Link>
      </div>

      {isComplimentary && (
        <p className="headline mt-8 inline-block border border-accent px-3 py-2 text-sm uppercase tracking-[0.06em] text-accent">
          {isVip
            ? "Special guest access · Your booking is complimentary"
            : "Delegate access · Your booking is complimentary"}
        </p>
      )}

      {(checkoutError || error) && (
        <p className="mt-6 border border-red-600 px-4 py-3 text-sm text-red-600">
          {checkoutError ?? error}
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
        <section>
          <h2 className="headline text-xl font-semibold uppercase">Your programmes</h2>
          <ul className="rule-t mt-5">
            {items.map((item) => (
              <li key={item.id} className="rule-b flex gap-4 py-5 md:gap-6">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="h-20 w-20 shrink-0 object-cover md:h-24 md:w-24"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="headline text-base font-semibold md:text-xl">{item.title}</h3>
                  <p className="headline mt-1 text-xs text-muted-foreground md:text-sm">
                    {item.date} · {item.time} · {item.venue}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      {item.qty} seat{item.qty === 1 ? "" : "s"}
                    </span>
                    <span className="font-medium">
                      {isComplimentary || item.price === 0
                        ? "Complimentary"
                        : formatCurrency(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="border border-foreground p-5 md:p-6 lg:sticky lg:top-24">
          <h2 className="headline text-xl font-semibold uppercase">Order summary</h2>

          {!isComplimentary && !appliedCoupon && (
            <form onSubmit={applyCoupon} className="rule-b mt-6 pb-6">
              <label htmlFor="coupon-code" className="label">
                Coupon code
              </label>
              <div className="mt-2 flex gap-2">
                <Input
                  id="coupon-code"
                  value={couponCode}
                  onChange={(event) => {
                    setCouponCode(event.target.value);
                    setCouponError(null);
                  }}
                  placeholder="Enter code"
                  autoComplete="off"
                  disabled={isApplyingCoupon || isCheckingOut}
                  className="min-w-0 uppercase"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || isCheckingOut}
                  className="label border border-foreground px-4 transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isApplyingCoupon ? "Applying…" : "Apply"}
                </button>
              </div>
              {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
            </form>
          )}

          {appliedCoupon && (
            <div className="rule-b mt-6 flex items-start justify-between gap-4 pb-6">
              <div>
                <p className="label text-accent">Coupon applied</p>
                <p className="mt-1 text-sm font-medium">{appliedCoupon.coupon.code}</p>
                {appliedCoupon.coupon.name && (
                  <p className="mt-1 text-sm text-muted-foreground">{appliedCoupon.coupon.name}</p>
                )}
              </div>
              <button
                type="button"
                onClick={removeCoupon}
                disabled={isCheckingOut}
                className="label text-muted-foreground hover:text-accent"
              >
                Remove
              </button>
            </div>
          )}

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatCurrency(orderSubtotal)}</dd>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between gap-4 text-accent">
                <dt>Coupon discount</dt>
                <dd>−{formatCurrency(couponDiscount)}</dd>
              </div>
            )}
            <div className="rule-t flex justify-between gap-4 pt-4 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => void checkout()}
            disabled={isCheckingOut || isApplyingCoupon}
            className="headline mt-8 w-full rounded-full bg-foreground px-6 py-4 text-lg font-semibold uppercase text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCheckingOut
              ? "Processing…"
              : total <= 0
                ? "Confirm booking →"
                : `Pay ${formatCurrency(total)} →`}
          </button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Your final total is validated securely before payment.
          </p>
        </aside>
      </div>

      {showSuccess && (
        <BookingSuccess
          onClose={() => {
            setShowSuccess(false);
            router.push("/dashboard");
          }}
        />
      )}
    </div>
  );
}
