import { combineReducers } from "@reduxjs/toolkit";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authReducer from "@/redux/slices/authSlice";

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
  whitelist: ["auth"],
};

export const rootReducer = combineReducers({
  auth: authReducer,
});
