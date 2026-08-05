"use client";

import { ReactNode } from "react";

// Since we're using Zustand with persist, we don't need a Context Provider
// But we'll keep this for compatibility if needed
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}