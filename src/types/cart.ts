import type { StaticImageData } from "next/image";

export type CartItem = {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: number;
  img: string | StaticImageData;
  qty: number;
};

export type CartItemInput = Omit<CartItem, "qty">;

export type CartState = {
  items: CartItem[];
  bookings: CartItem[];
  wishlist: string[];
  isVip: boolean;
};
