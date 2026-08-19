"use client";

import { Provider } from "react-redux";

import SessionExpiryRedirect from "@/components/auth/session-expiry-redirect";
import { AuthProvider } from "@/context/auth-context";
import { store } from "@/redux/store";

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <SessionExpiryRedirect />
        {children}
      </AuthProvider>
    </Provider>
  );
}
