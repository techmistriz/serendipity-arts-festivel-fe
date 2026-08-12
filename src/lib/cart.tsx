"use client";

import { StaticImageData } from "next/image";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

type CartCtx = {
  items: CartItem[];
  bookings: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  confirmBooking: () => void;
  count: number;
  subtotal: number;
  isRegistered: boolean;
  markRegistered: () => void;
  isLoggedIn: boolean;
  isVip: boolean;
  login: (vip?: boolean) => void;
  logout: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  hasBooked: (id: string) => boolean;
  justBooked: boolean;
  markJustBooked: () => void;
  clearJustBooked: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_KEY = "saf-cart";
const REG_KEY = "saf-registered";
const AUTH_KEY = "saf-auth";
const VIP_KEY = "saf-vip";
const WISH_KEY = "saf-wishlist";
const BOOKINGS_KEY = "saf-bookings";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<CartItem[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [justBooked, setJustBooked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setItems(JSON.parse(raw));
      const savedBookings = localStorage.getItem(BOOKINGS_KEY);
      if (savedBookings) setBookings(JSON.parse(savedBookings));
      setIsRegistered(localStorage.getItem(REG_KEY) === "1");
      setIsLoggedIn(localStorage.getItem(AUTH_KEY) === "1");
      setIsVip(localStorage.getItem(VIP_KEY) === "1");
      const w = localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch {} }, [items]);
  useEffect(() => { try { localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)); } catch {} }, [bookings]);
  useEffect(() => { try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch {} }, [wishlist]);

  const add: CartCtx["add"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) return prev.map((p) => p.id === item.id ? { ...p, qty: p.qty + qty } : p);
      return [...prev, { ...item, qty }];
    });
  };
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((p) => p.id === id ? { ...p, qty: Math.max(1, qty) } : p));
  const clear = () => setItems([]);
  const confirmBooking = () => {
    setBookings((previous) => {
      const next = [...previous];
      for (const item of items) {
        const index = next.findIndex((booking) => booking.id === item.id);
        if (index >= 0) next[index] = { ...next[index], qty: next[index].qty + item.qty };
        else next.push(item);
      }
      return next;
    });
    setItems([]);
    setJustBooked(true);
  };
  const markRegistered = () => {
    try { localStorage.setItem(REG_KEY, "1"); localStorage.setItem(AUTH_KEY, "1"); } catch {}
    setIsRegistered(true);
    setIsLoggedIn(true);
  };
  const login = (vip = false) => {
    try {
      localStorage.setItem(AUTH_KEY, "1"); localStorage.setItem(REG_KEY, "1");
      if (vip) localStorage.setItem(VIP_KEY, "1"); else localStorage.removeItem(VIP_KEY);
    } catch {}
    setIsLoggedIn(true);
    setIsRegistered(true);
    setIsVip(vip);
  };
  const logout = () => {
    try { localStorage.removeItem(AUTH_KEY); localStorage.removeItem(VIP_KEY); } catch {}
    setIsLoggedIn(false);
    setIsVip(false);
  };
  const toggleWish = (id: string) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const hasBooked = (id: string) => bookings.some((i) => i.id === id);
  const markJustBooked = () => setJustBooked(true);
  const clearJustBooked = () => setJustBooked(false);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <Ctx.Provider value={{ items, bookings, add, remove, setQty, clear, confirmBooking, count, subtotal, isRegistered, markRegistered, isLoggedIn, isVip, login, logout, wishlist, toggleWish, hasBooked, justBooked, markJustBooked, clearJustBooked }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
