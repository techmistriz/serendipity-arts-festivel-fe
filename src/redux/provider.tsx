"use client";

import { Provider } from "react-redux";
import SessionExpiryRedirect from "@/components/auth/session-expiry-redirect";
import { store } from "./store";
import AuthHydration from "./AuthHydration";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydration />
      <SessionExpiryRedirect />
      {children}
    </Provider>
  );
}
