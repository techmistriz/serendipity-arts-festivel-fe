import { imagePaths } from "@/config/images";
import API, { METHODS } from "@/network/API";
import type { ApiResponse } from "@/types/api";
import type { CartItem, CartItemInput } from "@/types/cart";
import { getApiResponseData } from "@/utils/api";

const PLACEHOLDER_IMAGE = imagePaths.programmeFallback;
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type ApiProgramme = {
  name?: string | null;
  program_image?: string | null;
};

type ApiProgrammeDetail = {
  event_date?: string | null;
  from_time?: string | null;
  venue?: { title?: string | null } | null;
};

type ApiCartItem = {
  id: number;
  program_id: number;
  program_detail_id: number;
  amount: string | number;
  quantity: number;
  program?: ApiProgramme | null;
  program_detail?: ApiProgrammeDetail | null;
};

type ApiBooking = {
  id: number;
  program_id: number;
  program_detail_id: number;
  title?: string | null;
  event_date?: string | null;
  from_time?: string | null;
  venue?: string | null;
  quantity: number;
  amount: number | string;
  image?: string | null;
};

type ApiCartPayload = {
  items: ApiCartItem[];
};

export type RazorpayCheckoutOptions = {
  name: string;
  description: string;
  currency: string;
  key: string;
  amount: number;
  order_id: string;
  prefill?: {
    name?: string | null;
    email?: string | null;
    contact?: string | null;
  };
  theme?: { color?: string };
};

export type CheckoutResult = {
  order: { id: number };
  paymentGateway: {
    name: string;
    checkout: RazorpayCheckoutOptions;
  } | null;
};

export type CouponValidation = {
  coupon: {
    code: string;
    name: string | null;
  };
  subtotal: number;
  discount: number;
  total: number;
};

const toPrice = (amount: string | number | null | undefined) => {
  const parsedAmount = Number(amount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
};

const toTime = (time: string | null | undefined) => (time ? time.slice(0, 5) : "Time TBA");

function toDate(value: string | null | undefined) {
  if (!value) return "Date TBA";

  const isoMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
  if (isoMatch) {
    return `${Number(isoMatch[3])} ${MONTH_NAMES[Number(isoMatch[2]) - 1]}`;
  }

  const localMatch = /^(\d{1,2})[-/](\d{1,2})[-/]\d{4}$/.exec(value);
  if (localMatch) {
    return `${Number(localMatch[1])} ${MONTH_NAMES[Number(localMatch[2]) - 1]}`;
  }

  return value;
}

function toCartItem(item: ApiCartItem): CartItem {
  return {
    id: String(item.id),
    programmeId: item.program_id,
    programmeDetailId: item.program_detail_id,
    title: item.program?.name ?? "Untitled programme",
    venue: item.program_detail?.venue?.title ?? "Venue TBA",
    date: toDate(item.program_detail?.event_date),
    time: toTime(item.program_detail?.from_time),
    price: toPrice(item.amount),
    img: item.program?.program_image ?? PLACEHOLDER_IMAGE,
    qty: item.quantity,
  };
}

function toBooking(item: ApiBooking): CartItem {
  return {
    id: String(item.id),
    programmeId: item.program_id,
    programmeDetailId: item.program_detail_id,
    title: item.title ?? "Untitled programme",
    venue: item.venue ?? "Venue TBA",
    date: toDate(item.event_date),
    time: toTime(item.from_time),
    price: toPrice(item.amount),
    img: item.image ?? PLACEHOLDER_IMAGE,
    qty: item.quantity,
  };
}

export async function getCart(): Promise<CartItem[]> {
  const response = await API<ApiResponse<ApiCartPayload>>("/cart", METHODS.GET);
  return getApiResponseData(response, "Unable to load your cart.").items.map(toCartItem);
}

export async function getBookings(): Promise<CartItem[]> {
  const response = await API<ApiResponse<ApiBooking[]>>("/cart/bookings", METHODS.GET);
  return getApiResponseData(response, "Unable to load your bookings.").map(toBooking);
}

export async function addCartItem(input: CartItemInput): Promise<CartItem> {
  const response = await API<ApiResponse<ApiCartItem>>("/cart/add", METHODS.POST, {
    program_id: input.programmeId,
    program_detail_id: input.programmeDetailId,
    qty: input.quantity,
    check_clashing: input.checkClashing ?? true,
  });

  return toCartItem(getApiResponseData(response, "Unable to add this programme to your cart."));
}

export async function updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
  const response = await API<ApiResponse<ApiCartItem | null>>(`/cart/update/${id}`, METHODS.POST, {
    qty: quantity,
  });

  const item = getApiResponseData(response, "Unable to update this cart item.");
  return item ? toCartItem(item) : null;
}

export async function removeCartItem(id: string): Promise<void> {
  const response = await API<ApiResponse<null>>(`/cart/remove/${id}`, METHODS.POST);
  getApiResponseData(response, "Unable to remove this cart item.");
}

export async function clearCart(): Promise<void> {
  const response = await API<ApiResponse<null>>("/cart/clear", METHODS.POST);
  getApiResponseData(response, "Unable to clear your cart.");
}

export async function createCheckout(input: {
  name: string;
  email: string;
  couponCode?: string;
}): Promise<CheckoutResult> {
  const { couponCode, ...checkoutInput } = input;
  const response = await API<
    ApiResponse<{
      order: { id: number };
      payment_gateway?: { name: string; checkout: RazorpayCheckoutOptions };
    }>
  >("/checkout", METHODS.POST, {
    ...checkoutInput,
    coupon_code: couponCode,
    platform: "WEB",
  });

  const data = getApiResponseData(response, "Unable to start checkout.");

  return {
    order: data.order,
    paymentGateway: data.payment_gateway ?? null,
  };
}

export async function validateCheckoutCoupon(couponCode: string): Promise<CouponValidation> {
  const response = await API<ApiResponse<CouponValidation>>(
    "/checkout/validate-coupon",
    METHODS.POST,
    { coupon_code: couponCode },
  );

  return getApiResponseData(response, "Unable to apply this coupon.");
}

export async function verifyCheckout(input: {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<void> {
  const response = await API<ApiResponse<unknown>>("/checkout/verify-payment", METHODS.POST, {
    order_id: input.orderId,
    razorpay_order_id: input.razorpayOrderId,
    razorpay_payment_id: input.razorpayPaymentId,
    razorpay_signature: input.razorpaySignature,
  });

  getApiResponseData(response, "Unable to verify your payment.");
}

export async function cancelCheckout(orderId: number): Promise<void> {
  const response = await API<ApiResponse<unknown>>("/checkout/cancel-payment", METHODS.POST, {
    order_id: orderId,
  });

  getApiResponseData(response, "Unable to cancel your payment checkout.");
}
