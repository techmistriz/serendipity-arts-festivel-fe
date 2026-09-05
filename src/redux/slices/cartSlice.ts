import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { CartItem, CartState } from "@/types/cart";

const initialState: CartState = {
  items: [],
  bookings: [],
  loading: false,
  error: null,
  synced: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.bookings = [];
      state.loading = false;
      state.error = null;
      state.synced = false;
    },

    requestCart: (state) => {
      state.loading = true;
      state.error = null;
    },

    setCart: (state, action: PayloadAction<{ items: CartItem[]; bookings: CartItem[] }>) => {
      state.items = action.payload.items;
      state.bookings = action.payload.bookings;
      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    upsertCartItem: (state, action: PayloadAction<CartItem>) => {
      const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);

      if (itemIndex === -1) {
        state.items.push(action.payload);
      } else {
        state.items[itemIndex] = action.payload;
      }

      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.synced = true;
    },

    cartRequestFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  cartRequestFailed,
  clearCart,
  clearCartState,
  removeFromCart,
  requestCart,
  setCart,
  upsertCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;
