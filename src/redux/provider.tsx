"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import SessionExpiryRedirect from "@/components/auth/session-expiry-redirect";
import { useAuthSessionBootstrap } from "@/hooks/use-auth-session-bootstrap";
import { persistor, store } from "@/redux/store";

function AuthSessionInitializer() {
  useAuthSessionBootstrap();

  return null;
}

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthSessionInitializer />
        <SessionExpiryRedirect />
        {children}
      </PersistGate>
    </Provider>
  );
}
