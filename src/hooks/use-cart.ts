"use client";

import { useCallback, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addToCart,
  clearCart,
  confirmBooking,
  removeFromCart,
  setCartItemQuantity,
} from "@/redux/slices/cartSlice";
import type { CartItemInput } from "@/types/cart";

export function useCart() {
  const dispatch = useAppDispatch();
  const { bookings, isVip, items } = useAppSelector((state) => state.cart);

  const add = useCallback(
    (item: CartItemInput, quantity = 1) => {
      dispatch(addToCart({ item, quantity }));
    },
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => {
      dispatch(removeFromCart(id));
    },
    [dispatch],
  );

  const setQty = useCallback(
    (id: string, quantity: number) => {
      dispatch(setCartItemQuantity({ id, quantity }));
    },
    [dispatch],
  );

  const clear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const completeBooking = useCallback(() => {
    dispatch(confirmBooking());
  }, [dispatch]);

  const hasBooked = useCallback(
    (id: string) => bookings.some((item) => item.id === id),
    [bookings],
  );

  const count = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.qty * item.price, 0),
    [items],
  );

  return {
    add,
    bookings,
    clear,
    confirmBooking: completeBooking,
    count,
    hasBooked,
    isVip,
    items,
    remove,
    setQty,
    subtotal,
  };
}
