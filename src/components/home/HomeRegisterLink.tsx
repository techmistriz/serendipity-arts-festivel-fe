"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/use-auth";

export function HomeRegisterLink() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return null;

  return (
    <Link
      href="/register"
      className="label shrink-0 rounded-full bg-white px-3.5 py-1.5 whitespace-nowrap text-black transition-colors hover:bg-white/90 md:px-5 md:py-2"
    >
      Register
    </Link>
  );
}
