"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthSessionBootstrap } from "@/hooks/use-auth-session-bootstrap";
import { useAppDispatch } from "@/redux/hooks";
import { clearSession } from "@/redux/slices/authSlice";
import { persistor, store } from "@/redux/store";

function AuthSessionManager() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useAuthSessionBootstrap();

  useEffect(() => {
    const handleSessionExpiry = () => {
      dispatch(clearSession());
      router.replace("/login");
    };

    window.addEventListener("saf:session-expired", handleSessionExpiry);

    return () => window.removeEventListener("saf:session-expired", handleSessionExpiry);
  }, [dispatch, router]);

  return null;
}

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthSessionManager />
        {children}
      </PersistGate>
    </Provider>
  );
}
