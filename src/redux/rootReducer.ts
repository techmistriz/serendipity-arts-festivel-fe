import { combineReducers } from "@reduxjs/toolkit";
import { createMigrate, type PersistedState } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authReducer from "@/redux/slices/authSlice";
import cartReducer from "@/redux/slices/cartSlice";
import wishlistReducer from "@/redux/slices/wishlistSlice";
import type { CartState } from "@/types/cart";
import type { WishlistState } from "@/types/wishlist";

export const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (key: string, value: string) => {
    void key;
    return Promise.resolve(value);
  },
  removeItem: () => Promise.resolve(),
});

export const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

type PersistedRootState = Exclude<PersistedState, undefined> & {
  cart?: CartState & { wishlist?: unknown };
  wishlist?: WishlistState;
};

function migrateLegacyWishlist(state: PersistedState): PersistedState {
  if (!state) return state;

  const persistedState = state as PersistedRootState;
  const legacyCart = persistedState.cart;
  const legacyWishlist = legacyCart?.wishlist;

  if (!legacyCart || !Array.isArray(legacyWishlist) || persistedState.wishlist)
    return persistedState;

  const cart = { ...legacyCart };
  delete cart.wishlist;

  return {
    ...persistedState,
    cart,
    wishlist: {
      programmeIds: legacyWishlist.filter((id): id is string => typeof id === "string"),
    },
  } as PersistedState;
}

export const rootPersistConfig = {
  key: "serendipity-arts-festival",
  storage,
  keyPrefix: "redux-",
  version: 1,
  migrate: createMigrate({ 1: migrateLegacyWishlist }, { debug: false }),
  whitelist: ["auth", "cart", "wishlist"],
};

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});
