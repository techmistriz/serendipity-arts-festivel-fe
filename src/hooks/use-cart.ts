"use client";

import { useCallback, useEffect, useMemo } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { AppDispatch } from "@/redux/store";
import {
  cartRequestFailed,
  clearCart as clearCartState,
  clearCartState as clearCartForSignedOutUser,
  removeFromCart,
  requestCart,
  setCart,
  upsertCartItem,
} from "@/redux/slices/cartSlice";
import {
  addCartItem,
  clearCart as clearCartOnServer,
  getBookings,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";
import type { CartItemInput } from "@/types/cart";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

let cartSyncRequest: Promise<void> | null = null;

function syncCart(dispatch: AppDispatch) {
  if (!cartSyncRequest) {
    dispatch(requestCart());
    cartSyncRequest = Promise.all([getCart(), getBookings()])
      .then(([items, bookings]) => {
        dispatch(setCart({ items, bookings }));
      })
      .catch((error: unknown) => {
        dispatch(cartRequestFailed(getErrorMessage(error, "Unable to load your cart.")));
        throw error;
      })
      .finally(() => {
        cartSyncRequest = null;
      });
  }

  return cartSyncRequest;
}

export function useCart() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuth();
  const { bookings, error, items, loading, synced } = useAppSelector((state) => state.cart);

  const isVip = user?.role?.name?.toUpperCase() === "VIP";

  const refresh = useCallback(
    async (force = false) => {
      if (!isAuthenticated || (!force && synced)) return;
      await syncCart(dispatch);
    },
    [dispatch, isAuthenticated, synced],
  );

  useEffect(() => {
    if (isAuthenticated) {
      void refresh().catch(() => undefined);
    } else {
      dispatch(clearCartForSignedOutUser());
    }
  }, [dispatch, isAuthenticated, refresh]);

  const add = useCallback(
    async (input: CartItemInput) => {
      if (!isAuthenticated) {
        throw new Error("You must be logged in to add a programme to your cart.");
      }

      dispatch(requestCart());

      try {
        const existingItem = items.find(
          (item) => item.programmeDetailId === input.programmeDetailId,
        );
        const item = existingItem
          ? await updateCartItem(existingItem.id, Math.min(existingItem.qty + input.quantity, 5))
          : await addCartItem(input);

        if (!item) {
          throw new Error("This cart item could not be updated.");
        }

        dispatch(upsertCartItem(item));
        return item;
      } catch (error) {
        dispatch(
          cartRequestFailed(getErrorMessage(error, "Unable to add this programme to your cart.")),
        );
        throw error;
      }
    },
    [dispatch, isAuthenticated, items],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;

      dispatch(requestCart());

      try {
        await removeCartItem(id);
        dispatch(removeFromCart(id));
      } catch (error) {
        dispatch(cartRequestFailed(getErrorMessage(error, "Unable to remove this cart item.")));
        throw error;
      }
    },
    [dispatch, isAuthenticated],
  );

  const setQty = useCallback(
    async (id: string, quantity: number) => {
      if (!isAuthenticated) return;

      dispatch(requestCart());

      try {
        const item = await updateCartItem(id, quantity);

        if (item) {
          dispatch(upsertCartItem(item));
        } else {
          dispatch(removeFromCart(id));
        }
      } catch (error) {
        dispatch(cartRequestFailed(getErrorMessage(error, "Unable to update this cart item.")));
        throw error;
      }
    },
    [dispatch, isAuthenticated],
  );

  const clear = useCallback(async () => {
    if (!isAuthenticated) return;

    dispatch(requestCart());

    try {
      await clearCartOnServer();
      dispatch(clearCartState());
    } catch (error) {
      dispatch(cartRequestFailed(getErrorMessage(error, "Unable to clear your cart.")));
      throw error;
    }
  }, [dispatch, isAuthenticated]);

  const count = useMemo(() => items.reduce((total, item) => total + item.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.qty * item.price, 0),
    [items],
  );

  return {
    add,
    bookings,
    clear,
    count,
    error,
    isVip,
    items,
    loading,
    refresh,
    remove,
    setQty,
    subtotal,
  };
}
