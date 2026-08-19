import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItemInput, CartState } from "@/types/cart";

type AddToCartPayload = {
  item: CartItemInput;
  quantity?: number;
};

const initialState: CartState = {
  items: [],
  bookings: [],
  wishlist: [],
  isVip: false,
};

function normalizeQuantity(quantity: number | undefined): number {
  if (!Number.isFinite(quantity)) return 1;

  return Math.max(1, Math.floor(quantity ?? 1));
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const quantity = normalizeQuantity(action.payload.quantity);
      const existingItem = state.items.find((item) => item.id === action.payload.item.id);

      if (existingItem) {
        existingItem.qty += quantity;
        return;
      }

      state.items.push({ ...action.payload.item, qty: quantity });
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload.id);

      if (item) item.qty = normalizeQuantity(action.payload.quantity);
    },
    clearCart: (state) => {
      state.items = [];
    },
    confirmBooking: (state) => {
      for (const cartItem of state.items) {
        const booking = state.bookings.find((item) => item.id === cartItem.id);

        if (booking) {
          booking.qty += cartItem.qty;
        } else {
          state.bookings.push({ ...cartItem });
        }
      }

      state.items = [];
    },
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;

      state.wishlist = state.wishlist.includes(itemId)
        ? state.wishlist.filter((id) => id !== itemId)
        : [...state.wishlist, itemId];
    },
    setVipAccess: (state, action: PayloadAction<boolean>) => {
      state.isVip = action.payload;
    },
  },
});

export const {
  addToCart,
  clearCart,
  confirmBooking,
  removeFromCart,
  setCartItemQuantity,
  setVipAccess,
  toggleWishlistItem,
} = cartSlice.actions;

export default cartSlice.reducer;
