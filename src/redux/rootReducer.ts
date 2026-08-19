import { combineReducers } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authReducer from "@/redux/slices/authSlice";
import cartReducer from "@/redux/slices/cartSlice";

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

export const rootPersistConfig = {
  key: "serendipity-arts-festival",
  storage,
  keyPrefix: "redux-",
  whitelist: ["auth", "cart"],
};

export const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});
