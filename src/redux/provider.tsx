"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import SessionExpiryRedirect from "@/components/auth/session-expiry-redirect";
import { AuthProvider } from "@/context/auth-context";
import { persistor, store } from "@/redux/store";

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <SessionExpiryRedirect />
          {children}
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
