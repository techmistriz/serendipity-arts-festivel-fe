import type { RazorpayCheckoutOptions } from "@/services/cart.service";

export type RazorpayPaymentResponse = {
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

const SCRIPT_ID = "razorpay-checkout-script";
let scriptPromise: Promise<RazorpayConstructor> | null = null;

function loadRazorpay(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    let existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

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

      scriptPromise = null;
      reject(new Error("Razorpay failed to initialise."));
    };
    const onError = () => {
      script.dataset.loadState = "error";
      scriptPromise = null;
      reject(new Error("Unable to load Razorpay checkout."));
    };

    script.addEventListener("load", onLoad, { once: true });
    script.addEventListener("error", onError, { once: true });

    if (!existingScript) {
      script.id = SCRIPT_ID;
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return scriptPromise;
}

export async function openRazorpayCheckout(
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
